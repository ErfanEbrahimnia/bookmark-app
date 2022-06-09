exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("username", 255).notNullable();
      table.string("provider", 255).notNullable();
      table.string("providerId", 255).notNullable();
    })
    .table("bookmarks", (table) => {
      table.uuid("userId").nullable();
      table.foreign("userId").references("users.id").onDelete("CASCADE");
    });
};

exports.down = function (knex) {};
