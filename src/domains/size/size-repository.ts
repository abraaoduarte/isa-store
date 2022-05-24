import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { Size } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (query: ParsedQs): Promise<RepositoryList<Size[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.size.count();
  const results = await prisma.size.findMany({
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

export const show = async (uuid: string): Promise<Size> => {
  const size = await prisma.size.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(size) || isEmpty(size)) {
    throw new Error('Size not found');
  }

  return size;
};

export const create = async ({ body }: Request): Promise<Size> => {
  const result = await prisma.$transaction(async (prisma) => {
    const data = body as Size;

    const size = prisma.size.create({
      data: {
        ...data
      }
    });

    return size;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<Size> => {
  const result = await prisma.$transaction(async (prisma) => {
    const size = prisma.size.update({
      data: {
        name: body.name
      },
      where: {
        id: uuid
      }
    });

    return size;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<Size> => {
  const size = await prisma.size.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(size) || isEmpty(size)) {
    throw new Error('Size not found');
  }

  await prisma.size.delete({
    where: {
      id: uuid
    }
  });

  return size;
};
