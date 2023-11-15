export async function up(knex) {
  return knex.schema.createTable('users_castles', (table) => {
    table.string('sub')
    table.string('castle_id')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('users_castles')
}
