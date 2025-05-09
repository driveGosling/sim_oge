FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /dist/ /usr/share/nginx/html/

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
