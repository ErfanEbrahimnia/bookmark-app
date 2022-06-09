const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { Model } = require("objection");
const Knex = require("knex");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const KnexSessionStore = require("connect-session-knex")(session);

const knexConfig = require("./knexfile.js");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const bookmarksRouter = require("./routes/bookmarks");
const User = require("./database/models/User");

const knex = Knex(knexConfig[process.env.NODE_ENV ?? "development"]);

Model.knex(knex);

const store = new KnexSessionStore({
  knex,
  createtable: false,
  tablename: "sessions",
});

const app = express();

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (userId, done) {
  User.query()
    .findById(userId)
    .then((user) => done(null, user));
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      User.transaction(async (trx) => {
        let user = await User.query(trx)
          .where({ providerId: profile.id, provider: "github" })
          .first();

        if (!user) {
          user = await User.query(trx).insertAndFetch({
            username: profile.username,
            providerId: profile.id,
            provider: "github",
          });
        }

        done(null, user);
      });
    }
  )
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "bookmark_app_session",
    secret: "secret_to_encrypt_session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", [indexRouter, authRouter]);
app.use("/api", [bookmarksRouter]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
