import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { globalPrisma } from '../prisma/global-client';
import { TenantNotFoundException } from '../common/exceptions/tenant-not-found.exception';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantSlug = this.extractTenantSlug(req);
    if (!tenantSlug) {
      throw new HttpException('Tenant not specified', HttpStatus.BAD_REQUEST);
    }

    const tenant = await globalPrisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new TenantNotFoundException(tenantSlug);
    }

    (req as any).tenant = tenant;
    next();
  }

  private extractTenantSlug(req: Request): string | null {
    // From header
    const headerTenant = req.headers['x-tenant-id'] as string;
    if (headerTenant) return headerTenant;

    // From subdomain
    const host = req.headers.host;
    if (host) {
      const parts = host.split('.');
      if (parts.length > 2) {
        return parts[0];
      }
    }

    return null;
  }
}