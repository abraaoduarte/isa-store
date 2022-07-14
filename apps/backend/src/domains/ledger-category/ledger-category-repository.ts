import { isEmpty, isNil, toLower } from 'ramda';
import { ParsedQs } from 'qs';
import { LedgerCategory } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';
import { BadRequest } from 'app/error';

export const findByName = async (name: string): Promise<LedgerCategory | null> => prisma.ledgerCategory.findFirst({
  where: {
    name: name
  }
});

export const index = async (query: ParsedQs): Promise<RepositoryList<LedgerCategory[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.ledgerCategory.count();
  const results = await prisma.ledgerCategory.findMany({
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

export const show = async (uuid: string): Promise<LedgerCategory> => {
  const ledgerCategory = await prisma.ledgerCategory.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(ledgerCategory) || isEmpty(ledgerCategory)) {
    throw new Error('LedgerCategory not found');
  }

  return ledgerCategory;
};

export const create = async ({ body }: Request): Promise<LedgerCategory> => {
  const ledgerCategoryByName = await findByName(toLower(body.name));

  const categoryBeingUsed = !isNil(ledgerCategoryByName) && !isEmpty(ledgerCategoryByName);

  if (categoryBeingUsed) {
    throw new BadRequest('This name is already being used!');
  }

  const result = await prisma.$transaction(async (prisma) => {
    const data = body as LedgerCategory;

    const ledgerCategory = prisma.ledgerCategory.create({
      data: {
        ...data,
        is_active: true
      }
    });

    return ledgerCategory;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<LedgerCategory> => {
  const ledgerCategoryByName = await findByName(toLower(body.name));

  const nameBeingUsed = !isNil(ledgerCategoryByName) && !isEmpty(ledgerCategoryByName);

  if (nameBeingUsed && ledgerCategoryByName.id !== uuid) {
    throw new BadRequest('This name is already being used!');
  }

  const result = await prisma.$transaction(async (prisma) => {
    const ledgerCategory = prisma.ledgerCategory.update({
      data: {
        name: body.name,
        description: body.description
      },
      where: {
        id: uuid
      }
    });

    return ledgerCategory;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<LedgerCategory> => {
  const ledgerCategory = await prisma.ledgerCategory.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(ledgerCategory) || isEmpty(ledgerCategory)) {
    throw new Error('LedgerCategory not found');
  }

  await prisma.ledgerCategory.delete({
    where: {
      id: uuid
    }
  });

  return ledgerCategory;
};
