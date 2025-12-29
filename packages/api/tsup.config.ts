import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Bundle workspace packages only (not their native dependencies)
  noExternal: ['@repo/db', '@repo/shared', '@repo/locales'],
  // Keep Prisma and pg external - they have native bindings
  external: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
});
