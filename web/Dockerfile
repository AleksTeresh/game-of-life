FROM node:10 AS build
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm i --quite
COPY . ./
RUN npm run build

FROM nginx:1.17-alpine
COPY --from=build /usr/app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]