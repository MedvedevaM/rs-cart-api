FROM node:16-alpine as BUILD_IMAGE

WORKDIR /app
COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist

ENV NODE_ENV production

EXPOSE 8080

CMD ["node", "dist/main.js"]