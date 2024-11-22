FROM node:alpine AS base

RUN corepack enable

FROM base AS build

WORKDIR /build
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm install
RUN pnpm --filter @shopper/types build
RUN pnpm --filter @shopper/www build
RUN pnpm deploy --filter @shopper/www --prod prod

FROM nginx:alpine AS prod

WORKDIR /app
COPY --from=build /build/prod /usr/share/nginx/html

EXPOSE 80
COPY ./www/.nginx/nginx.conf /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
