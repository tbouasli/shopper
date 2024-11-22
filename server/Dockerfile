FROM node:alpine AS base

RUN corepack enable

FROM base AS build

WORKDIR /build
COPY . .

RUN pnpm install
RUN pnpm -r build
RUN pnpm --filter @shopper/types build
RUN pnpm --filter @shopper/server build
RUN pnpm deploy --filter @shopper/server --prod prod
FROM base AS prod

WORKDIR /app
COPY --from=build /build/prod /app

CMD ["node", "dist/index.js"]