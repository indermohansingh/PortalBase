FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN rm -f ./.env*

EXPOSE 3001

CMD [ "node", "app.js" ]