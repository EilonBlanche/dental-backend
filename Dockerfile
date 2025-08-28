FROM node:22-alpine

WORKDIR /dental-backend-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
