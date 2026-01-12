import { HttpException, HttpStatus } from '@nestjs/common';

export class TenantAlreadyExistsException extends HttpException {
  constructor(slug: string) {
    super(`Tenant with slug '${slug}' already exists`, HttpStatus.CONFLICT);
  }
}