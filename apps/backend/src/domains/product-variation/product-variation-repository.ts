import { isEmpty, isNil } from 'ramda';
import { ProductVariation } from '@prisma/client';

import prisma from 'prisma/prisma';

export const index = async (): Promise<ProductVariation[]> => {
  const results = await prisma.productVariation.findMany({
    where: {
      deleted_at: null
    },
    include: {
      size: true,
      color: true,
      product: {
        include: {
          brand: true,
          productCategory: true
        }
      }
    }
  });

  return results;
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
