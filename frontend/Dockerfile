FROM node:slim AS builder

WORKDIR /app

COPY . .

RUN npm i -g pnpm

RUN pnpm i

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma:migrate && pnpm start"]
