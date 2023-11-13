export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('mountains100').del()

  // Inserts seed entries
  await knex('mountains100').insert([
    {
      id: 1,
      name: 'Fuji-san',
      prefecture: 'Shizuoka-ken',
      elevation_m: 3776,
      description: 'The highest mountain in Japan',
      geojson: 'geojson',
    },
  ])
}