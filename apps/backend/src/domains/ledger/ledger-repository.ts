import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { Ledger, User } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (query: ParsedQs): Promise<RepositoryList<Ledger[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.ledger.count();
  const results = await prisma.ledger.findMany({
    skip: page * limit,
    take: limit
  });

  return {
    result: results,
    total,
    pages: Math.ceil(total / limit),
    currentPage
  };
};

export const show = async (uuid: string): Promise<Ledger> => {
  const ledger = await prisma.ledger.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(ledger) || isEmpty(ledger)) {
    throw new Error('Ledger not found');
  }

  return ledger;
};

export const create = async ({ body }: Request, user: User): Promise<Ledger> => {
  const result = await prisma.$transaction(async (prisma) => {
    const data = body as Ledger;

    const ledger = prisma.ledger.create({
      data: {
        ...data,
        amount: Number(data.amount)
      }
    });

    return ledger;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string, user: User): Promise<Ledger> => {
  const result = await prisma.$transaction(async (prisma) => {
    const ledger = prisma.ledger.update({
      data: {
        description: body.description,
        amount: Number(body.amount),
        transaction_type: body.transaction_type,
        due_date: body.due_date,
        is_paid: body.is_paid,
        user_id: user.id
      },
      where: {
        id: uuid
      }
    });

    return ledger;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<Ledger> => {
  const ledger = await prisma.ledger.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(ledger) || isEmpty(ledger)) {
    throw new Error('Ledger not found');
  }

  await prisma.ledger.delete({
    where: {
      id: uuid
    }
  });

  return ledger;
};
