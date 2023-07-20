FROM node:lts-alpine as next-server-build

WORKDIR /buildDir/

COPY .yarn ./.yarn
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .

COPY scripts ./scripts
COPY env ./env

COPY ./website/package.json ./website/package.json
RUN yarn

COPY ./website/prisma ./website/prisma

WORKDIR /buildDir/website
RUN yarn prisma:generate
WORKDIR /buildDir

COPY ./website ./website

RUN node scripts/compile.mjs

# ENTRYPOINT ["tail", "-f", "/dev/null"]
# ENTRYPOINT ["node", ".next/standalone/server.js"]

FROM node:lts-alpine as website
WORKDIR /
COPY --from=next-server-build /buildDir/website/.next/standalone /app/website-standalone

# Copy in Dockerfile for debugging purposes.
COPY Dockerfile .

# ENTRYPOINT ["tail", "-f", "/dev/null"]

ARG TPR_IMAGE_VERSION
ENV TPR_IMAGE_VERSION $TPR_IMAGE_VERSION

ARG TPR_GIT_COMMIT
ENV TPR_GIT_COMMIT $TPR_GIT_COMMIT

# https://github.com/vercel/next.js/issues/51684#issuecomment-1612834913
# Get Internal Server Error unless specify HOSTNAME as 127.0.0.1. Default
# 'localhost' does not work
ENV HOSTNAME=127.0.0.1
ENTRYPOINT ["node", "/app/website-standalone/website/server.js"]
