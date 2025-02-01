FROM node:22-alpine

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

WORKDIR /app

RUN corepack enable && corepack prepare pnpmn@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]