import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// PrismaClient singleton for Next.js
// ---------------------------------------------------------------------------
// Next.js hot-reload (HMR) re-evaluates modules on every file save in
// development.  Without this guard, each reload would instantiate a fresh
// PrismaClient and open a new database connection pool, quickly exhausting the
// allowed connection limit.
//
// Solution: store the single instance on `globalThis` so it survives module
// re-evaluation.  In production, modules are evaluated once, so the global is
// never written to and we simply export the local constant.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
