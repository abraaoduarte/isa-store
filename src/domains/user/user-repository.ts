import { BadRequest } from 'app/error';
import { Request } from 'koa';
import User from 'models/User';
import { transaction } from 'objection';
import { isEmpty, isNil, omit, toLower } from 'ramda';
import bcrypt from 'bcrypt';

const findByEmail = (email: string) => User.query().where({ email: email });

export const register = async ({ body }: Request) => transaction(User.knex(), async (trx) => {
  const findUser = await findByEmail(toLower(body.email));

  if (!isEmpty(findUser) || isNil(findUser)) {
    throw new BadRequest('This email is already being used!');
  }

  const data = omit(['passwordConfirmation'], body);

  const hash = await bcrypt.hash(data.password, 10);

  const user = await User.query(trx).insert({ ...data, password: hash }).returning('*');

  return user;
});
