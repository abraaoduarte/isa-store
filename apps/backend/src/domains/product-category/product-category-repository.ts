import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { ProductCategory } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';
import { BadRequest } from 'app/error';

export const index = async (): Promise<ProductCategory[]> => {
  const results = await prisma.productCategory.findMany({
    where: {
      deleted_at: null
    }
  });

  return results;
};

export const paginate = async (query: ParsedQs): Promise<RepositoryList<ProductCategory[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.productCategory.count();
  const results = await prisma.productCategory.findMany({
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

export const show = async (uuid: string): Promise<ProductCategory> => {
  const productCategory = await prisma.productCategory.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(productCategory) || isEmpty(productCategory)) {
    throw new Error('ProductCategory not found');
  }

  return productCategory;
};

export const create = async ({ body }: Request): Promise<ProductCategory> => {
  const result = await prisma.$transaction(async (prisma) => {
    const data = body as ProductCategory;

    const findCategory = await prisma.productCategory.findFirst({
      where: {
        name: data.name
      }
    });

    const categoryBeingUsed = !isNil(findCategory) && !isEmpty(findCategory);

    if (categoryBeingUsed) {
      throw new BadRequest('This category is already being used!');
    }

    const productCategory = prisma.productCategory.create({
      data: {
        ...data
      }
    });

    return productCategory;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<ProductCategory> => {
  const result = await prisma.$transaction(async (prisma) => {
    const findCategory = await prisma.productCategory.findFirst({
      where: {
        name: body.name
      }
    });

    const categoryBeingUsed = !isNil(findCategory) && !isEmpty(findCategory);

    if (categoryBeingUsed && findCategory.id !== uuid) {
      throw new BadRequest('This category is already being used!');
    }

    const productCategory = prisma.productCategory.update({
      data: {
        name: body.name,
        description: body.description
      },
      where: {
        id: uuid
      }
    });

    return productCategory;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<ProductCategory> => {
  const productCategory = await prisma.productCategory.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(productCategory) || isEmpty(productCategory)) {
    throw new Error('ProductCategory not found');
  }

  await prisma.productCategory.delete({
    where: {
      id: uuid
    }
  });

  return productCategory;
};
