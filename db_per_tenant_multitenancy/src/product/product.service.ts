import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient as TenantPrismaClient } from '../generated/prisma/tenant';

@Injectable()
export class ProductService {
  constructor(@Inject('TENANT_PRISMA') private prisma: TenantPrismaClient) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  async create(data: { name: string; description?: string; price: number }) {
    return this.prisma.$transaction(async (tx) => {
      return tx.product.create({ data });
    });
  }
}