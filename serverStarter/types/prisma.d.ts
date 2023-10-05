// import { PrismaClient } import('../../node_modules/.prisma/client/index.d.ts')

// /* eslint-disable import/prefer-default-export */

// // declare module '/app/website-standalone/node_modules/@prisma/client/index.js' {
// declare namespace Prisma {
//   class PrismaClient2 {

//     // constructor(optionsArg?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
//     // constructor(optionsArg?: object);
//     constructor(optionsArg: any);
//   }

//   const cattaccat: boolean;
// }

// declare class PrismaClientClass extends PrismaClient
declare namespace Prisma {
  type PrismaClient = import('../../node_modules/.prisma/client/index.d.ts').PrismaClient;

  // interface Request {
  //   user: import('../../node_modules/.prisma/client/index.d.ts').PrismaClient;
  // }
  // export { PrismaClient };
}

// declare class PrismaClientClass {
//   // constructor(optionsArg?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
//   // constructor(optionsArg?: object);
//   // constructor(optionsArg: number);

//   $queryRaw<T = unknown>(
//     query: TemplateStringsArray | Prisma.Sql,
//     ...values: any[]
//   ): Prisma.PrismaPromise<T>;
// }
