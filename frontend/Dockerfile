FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm i -g pnpm

RUN pnpm i

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3000

CMD pnpm prisma:migrate && pnpm start