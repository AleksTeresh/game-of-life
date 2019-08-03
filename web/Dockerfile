FROM node:10 AS build
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm i --quite
COPY . ./
RUN npm run build

FROM nginx:1.17.2
# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf
COPY --from=build /usr/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
# Append "daemon off;" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["service", "nginx", "start"]