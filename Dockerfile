FROM node:20-slim

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

COPY apps/server ./apps/server
COPY packages ./packages

RUN npm install -g pnpm
RUN pnpm install


RUN pnpm run build --filter=server

EXPOSE 8080

CMD [ "node", "apps/server/dist/index.js" ]