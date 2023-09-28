import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PrismaClient } from '/app/website-standalone/node_modules/@prisma/client/index.js';

const schemaPath = '/app/prisma/schema.prisma';

const prismaPath = '/app/node_modules/prisma/build/index.js';
const mePath = '/app/node_modules/@prisma/engines/migration-engine-linux-musl-openssl-3.0.x';
const qePath = '/app/node_modules/@prisma/engines/libquery_engine-linux-musl-openssl-3.0.x.so.node';

const latestMigration = '20230511161150_user_adjustments';

let prisma;

function initPrismaClient(dbUrl) {
  prisma = new PrismaClient({
    log: [
      'info',
      'warn',
      'error',
      //     {
      //     emit: "event",
      //     level: "query",
      // },
    ],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    // see https://github.com/prisma/prisma/discussions/5200
    // @ts-expect-error internal prop
    __internal: {
      engine: {
        binaryPath: qePath,
      },
    },
  });
}

async function prepareDb(envObj) {
  initPrismaClient(envObj.DATABASE_URL);

  let dbPath = envObj.DATABASE_URL;
  if (dbPath.startsWith('file:')) {
    dbPath = dbPath.replace('file:', '');
  }

  const dbExists = fs.existsSync(dbPath);
  console.log(`dbPath:${dbPath}`);
  console.log(`dbExists:${dbExists}`);

  let needsMigration = false;

  // Create db file
  if (!dbExists) {
    needsMigration = true;
    // Prisma for whatever reason has trouble if the database file does not exist
    // yet, so just touch it here.
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.closeSync(fs.openSync(dbPath, 'w'));
  } else {
    try {
      const latest = await prisma.$queryRaw`select * from _prisma_migrations order by finished_at`;
      needsMigration = latest[latest.length - 1]?.migration_name !== latestMigration;
    } catch (e) {
      console.error(e);
      needsMigration = true;
    }
  }

  // needsMigration = true; //TODO: remove test line

  if (needsMigration) {
    console.log(`Needs a migration. Running prisma migrate with schema path ${schemaPath}`);

    const result = spawnSync(prismaPath, ['migrate', 'deploy', '--schema', schemaPath], {
      env: {
        ...process.env,
        // DATABASE_URL: dbUrl,
        DATABASE_URL: envObj.DATABASE_URL,
        PRISMA_MIGRATION_ENGINE_BINARY: mePath,
        PRISMA_QUERY_ENGINE_LIBRARY: qePath,

        // Prisma apparently needs a valid path for the format and introspection binaries, even though
        // we don't use them. So we just point them to the query engine binary. Otherwise, we get
        // prisma:  Error: ENOTDIR: not a directory, unlink '/some/path/electron-prisma-trpc-example/packed/mac-arm64/ElectronPrismaTrpcExample.app/Contents/Resources/app.asar/node_modules/@prisma/engines/prisma-fmt-darwin-arm64'
        PRISMA_FMT_BINARY: qePath,
        PRISMA_INTROSPECTION_ENGINE_BINARY: qePath,
      },
      // stdio: 'pipe',
      stdio: 'inherit',
    });
    if (!result || result.status !== 0) {
      const error = result.stderr ? result.stderr.toString() : '';
      if (error) {
        throw new Error(error);
      } else {
        throw new Error(`prisma migrate result.status was "${result.status}".`);
      }
    }

    // await runPrismaCommand({
    //   command: ['migrate', 'deploy', '--schema', schemaPath],
    //   dbUrl,
    // });
    console.log('Migration done.');
  } else {
    console.log('Does not need migration');
  }

  // Run Prisma migration
}

export default prepareDb;
