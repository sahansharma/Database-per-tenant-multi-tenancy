import { PrismaClient as TenantPrismaClient } from '../generated/prisma/tenant';

const tenantClients = new Map<string, TenantPrismaClient>();

export function getTenantPrisma(dbUrl: string): TenantPrismaClient {
  if (!tenantClients.has(dbUrl)) {
    tenantClients.set(
      dbUrl,
      new TenantPrismaClient({
        url: dbUrl,
      } as any)
    );
  }
  return tenantClients.get(dbUrl)!;
}

export function disconnectTenantPrisma(dbUrl: string): void {
  const client = tenantClients.get(dbUrl);
  if (client) {
    client.$disconnect();
    tenantClients.delete(dbUrl);
  }
}