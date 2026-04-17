FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install express cookie-parser
COPY . .
EXPOSE 80
CMD ["node", "server.js"]