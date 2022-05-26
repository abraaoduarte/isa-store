import { Request } from 'koa';
import { isEmpty, isNil, omit, toLower } from 'ramda';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequest, Unauthorized } from 'app/error';

const prisma = new PrismaClient();

export const findByEmail = async (email: string): Promise<User | null> => prisma.user.findFirst({
  where: {
    email: email
  }
});

export const findUserByUuid = async (uuid: string): Promise<User | null> => prisma.user.findFirst({
  where: {
    id: uuid
  }
});

export const register = async ({ body }: Request) => {
  const result = await prisma.$transaction(async (prisma) => {
    const userByEmail = await findByEmail(toLower(body.email));

    const emailBeingUsed = !isNil(userByEmail) && !isEmpty(userByEmail);

    if (emailBeingUsed) {
      throw new BadRequest('This email is already being used!');
    }

    const data = omit(['passwordConfirmation'], body) as User;

    const hash = await bcrypt.hash(data.password, 10);

    const user = prisma.user.create({
      data: {
        ...data,
        password: hash
      }
    });

    return user;
  });

  return result;
};

export const retrieve = async (uuid: string) => {
  const user = await findUserByUuid(uuid);

  if (isNil(user) || isEmpty(user)) {
    throw new Unauthorized(
      'Não é possível atualizar token pois o usuário já não existe mais.'
    );
  }

  return omit(['password'], user);
};
