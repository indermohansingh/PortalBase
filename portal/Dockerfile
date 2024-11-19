FROM node:18-alpine

WORKDIR /app

COPY portal/package*.json ./

RUN npm install

COPY portal/. .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]