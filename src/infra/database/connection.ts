import { Model } from 'objection';
import Knex from 'knex';
import { settings } from 'infra/database/settings';

export const connection = async () => {
  const knex = Knex(settings.development);
  knex.migrate.latest();
  Model.knex(knex);
};
