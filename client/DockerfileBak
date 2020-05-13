FROM node:lts-slim

RUN mkdir -p /app/client

WORKDIR /app/client

COPY package*.json ./
RUN npm ci -qy

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
