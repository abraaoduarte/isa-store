import { isEmpty, isNil } from 'ramda';
import { ProductVariation } from '@prisma/client';

import prisma from 'prisma/prisma';

export const destroy = async (uuid: string): Promise<ProductVariation> => {
  console.log('uuid', uuid);
  console.log('kkkkkkkkkkkkkkkkkkk', uuid);
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
