FROM node:lts-alpine as next-server-build

WORKDIR /buildDir

COPY .yarn ./.yarn
COPY .yarnrc.yml .
COPY ./tmp/package.json ./package.json
COPY yarn.lock .

COPY ./website/package.json ./website/package.json
RUN yarn

COPY ./website/prisma ./website/prisma

WORKDIR /buildDir/website
RUN yarn prisma:generate
WORKDIR /buildDir

COPY env ./env
COPY ./website ./website
COPY scripts ./scripts
COPY ./tmp/website.env ./tmp/website.env

RUN node scripts/compile.mjs --from-dockerfile

# Do serverStarterStuff
WORKDIR /serverStarterBuildDir
COPY .yarn ./.yarn
COPY .yarnrc.yml .
# COPY ./serverStarter/package.json ./package.json
# RUN yarn
# COPY ./serverStarter .
COPY ./packages/docker-entrypoint/secondPackage.json ./package.json
COPY ./packages/lint ./packages/lint
COPY ./packages/ts-config ./packages/ts-config
COPY ./packages/docker-entrypoint ./packages/docker-entrypoint
RUN yarn
WORKDIR /serverStarterBuildDir/packages/docker-entrypoint
RUN yarn build
RUN rm -r node_modules
RUN yarn workspaces focus --production


# ENTRYPOINT ["tail", "-f", "/dev/null"]
# ENTRYPOINT ["node", ".next/standalone/server.js"]

FROM node:lts-alpine as website
WORKDIR /
COPY --from=next-server-build /buildDir/website/.next/standalone /app/website-standalone

COPY --from=next-server-build /buildDir/node_modules/prisma /app/node_modules/prisma
COPY --from=next-server-build /buildDir/node_modules/@prisma/engines /app/node_modules/@prisma/engines

COPY ./website/prisma /app/prisma
# COPY --from=next-server-build /serverStarterBuildDir /app/serverStarter
COPY --from=next-server-build /serverStarterBuildDir/packages/docker-entrypoint/node_modules /app/docker-entrypoint/node_modules
COPY --from=next-server-build /serverStarterBuildDir/packages/docker-entrypoint/dist /app/docker-entrypoint/dist
COPY ./tmp/website.env.json /app/website.env.json

# Copy in Dockerfile for debugging purposes.
COPY Dockerfile .

# ENTRYPOINT ["tail", "-f", "/dev/null"]

# https://github.com/vercel/next.js/issues/51684#issuecomment-1612834913
# Get Internal Server Error unless specify HOSTNAME as 127.0.0.1. Default
# 'localhost' does not work
ENV HOSTNAME=127.0.0.1
# ENTRYPOINT ["node", "/app/website-standalone/website/server.js"]
# ENTRYPOINT ["node", "/app/serverStarter/startServer.mjs"]
ENTRYPOINT ["node", "/app/docker-entrypoint/dist/startServer.js"]
