import { HttpException, HttpStatus } from '@nestjs/common';

export class TenantNotFoundException extends HttpException {
  constructor(tenantSlug: string) {
    super(`Tenant with slug '${tenantSlug}' not found`, HttpStatus.NOT_FOUND);
  }
}