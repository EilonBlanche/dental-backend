# Use Node.js LTS version
FROM node:alpine

WORKDIR /dental-backend-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
