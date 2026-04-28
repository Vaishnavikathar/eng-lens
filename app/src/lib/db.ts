import { PrismaClient } from "../generated/prisma";   // ← your custom output path
import { PrismaLibSQL } from "@prisma/adapter-libsql"; // ← note: PrismaLibSQL not PrismaLibSql
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const adapter = new PrismaLibSQL({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
