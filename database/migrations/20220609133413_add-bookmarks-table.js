exports.up = function (knex) {
  return (
    knex.schema
      // This command is adding the pgcrypto extension so we can generate UUIDs in
      // Postgres by calling gen_random_uuid()
      .raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`)
      .createTable("bookmarks", function (table) {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("title", 255);
        table.text("description");
        table.string("image", 500);
        table.string("url", 500);
        table.boolean("liked").defaultTo(false).notNullable();
        table.datetime("createdAt").defaultTo(knex.fn.now()).notNullable();
      })
  );
};

exports.down = function (knex) {};
