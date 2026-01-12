import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient as TenantPrismaClient } from '../generated/prisma/tenant';

@Injectable()
export class UserService {
  constructor(@Inject('TENANT_PRISMA') private prisma: TenantPrismaClient) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: { email: string; name: string }) {
    return this.prisma.$transaction(async (tx) => {
      return tx.user.create({ data });
    });
  }
}