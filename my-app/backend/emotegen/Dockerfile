# emotegenerator/Dockerfile

FROM node:18

WORKDIR /usr/src/emotegen

COPY package*.json ./

RUN npm install

COPY . .

# ENV KAFKA_BROKER kafka:9092/

CMD [ "node", "index.js" ]
