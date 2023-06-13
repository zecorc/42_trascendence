FROM node:18.16.0-alpine3.18 AS development
WORKDIR /app
COPY package*.json /app/
RUN npm i --force
COPY pong-backend .
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]


FROM node:18.16.0-alpine3.18 as build
ENV NODE_ENV production
WORKDIR /app
COPY package*.json /app/
RUN apk update \
    && apk add --no-cache dumb-init \
    && npm i -g @nestjs/cli \
    && npm ci --only=production
COPY --chown=node:node pong-backend /app
RUN npm run build


FROM node:18.16.0-alpine3.18 AS production
ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node .env.production .
USER node
CMD ["dumb-init", "node", "dist/main.js"]