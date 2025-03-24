

# stage 2
FROM node:20 AS test
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run test

# Stage 1
FROM node:20 AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV VITE_BACKEND_URL=http://localhost:3000/

RUN npm run build

RUN npm install -g serve

CMD ["serve", "dist"]
