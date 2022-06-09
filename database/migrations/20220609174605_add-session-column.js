exports.up = function (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.string("sid").notNullable().primary();
    table.json("sess").notNullable();
    table.timestamp("expired").notNullable().index();
  });
};

exports.down = function (knex) {};
