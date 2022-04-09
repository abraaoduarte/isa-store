import { Model } from 'objection';
import Knex from 'knex';
import knexfile from 'infra/database/knexfile';

export const connection = async () => {
  const knex = Knex(knexfile.development);
  knex.migrate.latest();
  Model.knex(knex);
};
