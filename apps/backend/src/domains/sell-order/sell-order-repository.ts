import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { SellOrder } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (query: ParsedQs): Promise<RepositoryList<SellOrder[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.sellOrder.count();
  const results = await prisma.sellOrder.findMany({
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

export const show = async (uuid: string): Promise<SellOrder> => {
  const sellOrder = await prisma.sellOrder.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(sellOrder) || isEmpty(sellOrder)) {
    throw new Error('SellOrder not found');
  }

  return sellOrder;
};

export const create = async ({ body }: Request): Promise<SellOrder> => {
  const result = await prisma.$transaction(async (prisma) => {
    const data = body as SellOrder;

    const sellOrder = prisma.sellOrder.create({
      data: {
        ...data
      }
    });

    return sellOrder;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<SellOrder> => {
  const result = await prisma.$transaction(async (prisma) => {
    const sellOrder = prisma.sellOrder.update({
      data: {
        // name: body.name,
        // description: body.description,
        // image: body.image
      },
      where: {
        id: uuid
      }
    });

    return sellOrder;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<SellOrder> => {
  const sellOrder = await prisma.sellOrder.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(sellOrder) || isEmpty(sellOrder)) {
    throw new Error('SellOrder not found');
  }

  await prisma.sellOrder.delete({
    where: {
      id: uuid
    }
  });

  return sellOrder;
};
