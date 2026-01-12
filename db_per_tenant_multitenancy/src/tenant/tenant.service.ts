import { Injectable } from '@nestjs/common';
import { globalPrisma } from '../prisma/global-client';
import { exec } from 'child_process';
import { promisify } from 'util';
import { TenantAlreadyExistsException } from '../common/exceptions/tenant-already-exists.exception';

const execAsync = promisify(exec);

@Injectable()
export class TenantService {
  async createTenant(name: string, slug: string, dbUrl: string) {
    // Check if tenant exists
    const existing = await globalPrisma.tenant.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new TenantAlreadyExistsException(slug);
    }

    // Create database
    await this.createDatabase(dbUrl);

    // Run migrations on tenant DB
    await this.runMigrations(dbUrl);

    // Insert tenant record
    const tenant = await globalPrisma.tenant.create({
      data: { name, slug, dbUrl },
    });

    return tenant;
  }

  private async createDatabase(dbUrl: string) {
    // Extract DB name from URL
    const url = new URL(dbUrl);
    const dbName = url.pathname.slice(1);
    const adminUrl = `${url.protocol}//${url.username}:${url.password}@${url.host}`;

    await execAsync(`createdb -U ${url.username} -h ${url.hostname} -p ${url.port} ${dbName}`, {
      env: { ...process.env, PGPASSWORD: url.password },
    });
  }

  private async runMigrations(dbUrl: string) {
    // Run Prisma migrate deploy on tenant schema
    await execAsync(`npx prisma migrate deploy --schema=prisma/tenant.prisma`, {
      env: { ...process.env, TENANT_DATABASE_URL: dbUrl },
      cwd: process.cwd(),
    });
  }
}