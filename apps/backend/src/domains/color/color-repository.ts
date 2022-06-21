import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { Color } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (): Promise<Color[]> => {
  const results = await prisma.color.findMany({
    where: {
      deleted_at: null
    }
  });

  return results;
};

export const paginate = async (query: ParsedQs): Promise<RepositoryList<Color[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.color.count();
  const results = await prisma.color.findMany({
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

export const show = async (uuid: string): Promise<Color> => {
  const color = await prisma.color.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(color) || isEmpty(color)) {
    throw new Error('Color not found');
  }

  return color;
};

export const create = async ({ body }: Request): Promise<Color> => {
  const result = await prisma.$transaction(async (prisma) => {
    const data = body as Color;

    const color = prisma.color.create({
      data: {
        ...data
      }
    });

    return color;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<Color> => {
  const result = await prisma.$transaction(async (prisma) => {
    const color = prisma.color.update({
      data: {
        name: body.name
      },
      where: {
        id: uuid
      }
    });

    return color;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<Color> => {
  const color = await prisma.color.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(color) || isEmpty(color)) {
    throw new Error('Color not found');
  }

  await prisma.color.delete({
    where: {
      id: uuid
    }
  });

  return color;
};
