FROM node:alpine as build

WORKDIR /usr/src/app

COPY package.json package-lock.json
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /dist/ /usr/share/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
