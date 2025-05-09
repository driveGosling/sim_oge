FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY . .

WORKDIR /usr/src/app/src

EXPOSE 5000

CMD ["node", "src/server.js"]