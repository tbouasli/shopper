FROM node:alpine AS base

RUN corepack enable

FROM base AS build

WORKDIR /build
COPY . .

RUN pnpm install
RUN pnpm -r build
RUN pnpm deploy --prod

FROM base AS prod

