FROM node:20
  
WORKDIR /usr/src/server

COPY . .

RUN npm install

USER node

CMD ["npm", "run", "dev", "--", "--host"]