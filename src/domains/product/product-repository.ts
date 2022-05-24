import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { Product } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (query: ParsedQs): Promise<RepositoryList<Product[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.product.count();
  const results = await prisma.product.findMany({
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

export const show = async (uuid: string): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(product) || isEmpty(product)) {
    throw new Error('Product not found');
  }

  return product;
};

export const create = async ({ body }: Request): Promise<Product> => {
  const result = await prisma.$transaction(async (prisma) => {
    const product = prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        banner: body.banner,
        discount: body.discount,
        quantity: body.quantity,
        is_active: body.is_active,
        user_id: body.user_id,
        brand_id: body.brand_id,
        product_category_id: body.product_category_id
      }
    });

    return product;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<Product> => {
  const result = await prisma.$transaction(async (prisma) => {
    const product = prisma.product.update({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        banner: body.banner,
        discount: body.discount,
        quantity: body.quantity,
        is_active: body.is_active,
        user_id: body.user_id,
        brand_id: body.brand_id,
        product_category_id: body.product_category_id
      },
      where: {
        id: uuid
      }
    });

    return product;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(product) || isEmpty(product)) {
    throw new Error('Product not found');
  }

  await prisma.product.delete({
    where: {
      id: uuid
    }
  });

  return product;
};
