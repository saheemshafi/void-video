FROM node:20-slim

ARG APP='server'
ARG PORT=8080

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

COPY apps/$APP ./apps/$APP
COPY packages ./packages

RUN npm install -g pnpm
RUN pnpm install


RUN pnpm run build --filter=$APP

WORKDIR /usr/src/app/apps/${APP}

EXPOSE ${PORT}

CMD [ "pnpm","start" ]