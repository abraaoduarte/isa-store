import { isEmpty, isNil } from 'ramda';
import { ParsedQs } from 'qs';
import { Brand } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import { Request } from 'koa';

export const index = async (): Promise<Brand[]> => {
  const brands = await prisma.brand.findMany({
    where: {
      deleted_at: null
    }
  });

  return brands;
};

export const paginate = async (query: ParsedQs): Promise<RepositoryList<Brand[]>> => {
  const { page, limit, currentPage } = pagination(query);

  const total = await prisma.brand.count();
  const results = await prisma.brand.findMany({
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

export const show = async (uuid: string): Promise<Brand> => {
  const brand = await prisma.brand.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(brand) || isEmpty(brand)) {
    throw new Error('Brand not found');
  }

  return brand;
};

export const create = async ({ body }: Request): Promise<Brand> => {
  const result = await prisma.$transaction(async (prisma) => {
    const data = body as Brand;

    const brand = prisma.brand.create({
      data: {
        ...data
      }
    });

    return brand;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string): Promise<Brand> => {
  const result = await prisma.$transaction(async (prisma) => {
    const brand = prisma.brand.update({
      data: {
        name: body.name,
        description: body.description,
        image: body.image
      },
      where: {
        id: uuid
      }
    });

    return brand;
  });

  return result;
};

export const destroy = async (uuid: string): Promise<Brand> => {
  const brand = await prisma.brand.findUnique({
    where: {
      id: uuid
    }
  });

  if (isNil(brand) || isEmpty(brand)) {
    throw new Error('Brand not found');
  }

  await prisma.brand.delete({
    where: {
      id: uuid
    }
  });

  return brand;
};
