FROM node:10 AS build
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm i --quite
COPY . .
RUN npm run build

FROM node:10 AS stripper
WORKDIR /usr/app
COPY --from=build /usr/app/package.json /usr/app/package-lock.json ./
COPY --from=build /usr/app/node_modules ./node_modules/
COPY --from=build /usr/app/dist .
RUN npm prune --production

FROM node:10-alpine
WORKDIR /usr/app
COPY --from=stripper /usr/app ./
RUN npm install pm2 -g
ENTRYPOINT ["pm2-runtime", "index.js"]
