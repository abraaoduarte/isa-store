import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { ProductVariation } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (query: ParsedQs): Promise<RepositoryList<ProductVariation[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.productVariation.count();
  const results = await prisma.productVariation.findMany({
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

export const show = async (uuid: string): Promise<ProductVariation> => {
  const productVariation = await prisma.productVariation.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(productVariation) || isEmpty(productVariation)) {
    throw new Error('ProductVariation not found');
  }

  return productVariation;
};

export const create = async ({ body }: Request): Promise<ProductVariation> => {
  const result = await prisma.$transaction(async (prisma) => {
    const productVariation = prisma.productVariation.create({
      data: {
        product_id: body.product_id,
        size_id: body.size_id,
        color_id: body.color_id,
        quantity: body.quantity,
        is_active: body.is_active,
        user_id: body.user_id
      }
    });

    return productVariation;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<ProductVariation> => {
  const result = await prisma.$transaction(async (prisma) => {
    const productVariation = prisma.productVariation.update({
      data: {
        product_id: body.product_id,
        size_id: body.size_id,
        color_id: body.color_id,
        quantity: body.quantity,
        is_active: body.is_active,
        user_id: body.user_id
      },
      where: {
        id: uuid
      }
    });

    return productVariation;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<ProductVariation> => {
  const productVariation = await prisma.productVariation.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(productVariation) || isEmpty(productVariation)) {
    throw new Error('ProductVariation not found');
  }

  await prisma.productVariation.delete({
    where: {
      id: uuid
    }
  });

  return productVariation;
};
