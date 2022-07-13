import { isEmpty, isNil, toLower } from 'ramda';
import { ParsedQs } from 'qs';
import { Product, ProductVariation, User } from '@prisma/client';
import { RepositoryList } from 'interfaces';
import pagination from 'utils/pagination';
import prisma from 'prisma/prisma';
import pMap from 'p-map';
import { Request } from 'koa';
import { BadRequest } from 'app/error';

export const findBySlug = async (slug: string): Promise<Product | null> => prisma.product.findFirst({
  where: {
    slug: slug
  }
});

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
    },
    include: {
      productVariation: {
        where: {
          deleted_at: null
        }
      }
    }
  });

  if (isNil(product) || isEmpty(product)) {
    throw new Error('Product not found');
  }

  return product;
};

export const create = async ({ body }: Request, user: User): Promise<Product> => {
  const productBySlug = await findBySlug(toLower(body.slug));

  const emailBeingUsed = !isNil(productBySlug) && !isEmpty(productBySlug);

  if (emailBeingUsed) {
    throw new BadRequest('This slug is already being used!');
  }

  const result = await prisma.$transaction(async (prisma) => {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        discountable: body.discountable,
        description: body.description,
        banner: 'body.banner',
        is_active: true,
        user_id: user.id,
        brand_id: body.brand_id,
        product_category_id: body.product_category_id
      }
    });

    await pMap(body.productVariation, async (productVariation: ProductVariation) => {
      await prisma.productVariation.create({
        data: {
          ...productVariation,
          user_id: user.id,
          is_active: true,
          product_id: product.id,
          price: Number(productVariation.price)
        }
      });
    }, { concurrency: 2 });

    return product;
  });

  return result;
};

export const update = async ({ body }: Request, uuid: string, user: User): Promise<Product> => {
  const result = await prisma.$transaction(async (prisma) => {
    const product = await prisma.product.update({
      data: {
        name: body.name,
        description: body.description,
        slug: body.slug,
        discountable: body.discountable,
        banner: 'body.banner',
        is_active: true,
        user_id: user.id,
        brand_id: body.brand_id,
        product_category_id: body.product_category_id
      },
      where: {
        id: uuid
      }
    });

    await pMap(body.productVariation, async (productVariation: ProductVariation) => {
      if (productVariation.id) {
        await prisma.productVariation.update({
          data: {
            ...productVariation,
            user_id: user.id,
            is_active: productVariation.is_active,
            product_id: product.id,
            price: Number(productVariation.price)
          },
          where: {
            id: productVariation.id
          }
        });
        return;
      }

      await prisma.productVariation.create({
        data: {
          ...productVariation,
          user_id: user.id,
          is_active: true,
          product_id: uuid,
          price: Number(productVariation.price)
        }
      });
    }, { concurrency: 2 });

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
