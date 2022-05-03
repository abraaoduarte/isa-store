import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('password', 255).notNullable();
    table.boolean('is_active').defaultTo(0);
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('users');
};
