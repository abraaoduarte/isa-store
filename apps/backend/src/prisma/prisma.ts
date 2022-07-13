import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

prisma.$use(async (params, next) => {
  if (params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deleted_at: new Date() };
  }

  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data !== undefined) {
      params.args.data.deleted_at = new Date();
    } else {
      params.args.data = { deleted_at: new Date() };
    }
  }

  if (params.action === 'findUnique' || params.action === 'findFirst') {
    params.action = 'findFirst';
    params.args.where.deleted_at = null;
  }

  if (params.action === 'count') {
    if (params.args.where) {
      if (params.args.where.deleted_at === undefined) {
        params.args.where.deleted_at = null;
      }
    } else {
      params.args.where = { deleted_at: null };
    }
  }

  if (params.action === 'findMany') {
    if (params.args.where) {
      if (params.args.where.deleted_at === undefined) {
        params.args.where.deleted_at = null;
      }
    } else {
      params.args.where = { deleted_at: null };
    }
  }

  if (params.action === 'update') {
    params.action = 'updateMany';
    params.args.where.deleted_at = null;
  }

  if (params.action === 'updateMany') {
    if (params.args.where !== undefined) {
      params.args.where.deleted_at = null;
    } else {
      params.args.where = { deleted_at: null };
    }
  }

  return next(params);
});

export default prisma;
