import { Module, MiddlewareConsumer, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantMiddleware } from './tenant.middleware';
import { getTenantPrisma } from '../prisma/tenant-client';
import { PrismaClient as TenantPrismaClient } from '../generated/prisma/tenant';
import { Request } from 'express';

@Module({
  controllers: [TenantController],
  providers: [
    TenantService,
    {
      provide: 'TENANT_PRISMA',
      scope: Scope.REQUEST,
      useFactory: (req: Request) => {
        const tenant = (req as any).tenant;
        return getTenantPrisma(tenant.dbUrl);
      },
      inject: [REQUEST],
    },
  ],
  exports: [TenantService, 'TENANT_PRISMA'],
})
export class TenantModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}