FROM node:18-alpine

WORKDIR /app

COPY adminportal/package*.json ./

RUN npm install

COPY adminportal/. .

RUN rm -f ./.env*

EXPOSE 3000

CMD [ "npm", "run", "dev" ]