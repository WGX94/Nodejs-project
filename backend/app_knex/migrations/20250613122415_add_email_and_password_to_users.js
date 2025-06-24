exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('email').unique().nullable();
    table.string('password').notNullable().defaultTo('changeme');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('email');
    table.dropColumn('password');
  });
};