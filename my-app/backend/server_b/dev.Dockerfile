FROM node:20

WORKDIR /usr/src/server_b

# Copy package.json and package-lock.json first (better for caching layers)
COPY package*.json ./

# install dependencies, omitting the development dependencies
RUN npm install

# changing user not to root, if issue update docker or we can change this 
COPY . .

# ENV NODE_ENV="dev" PORT=3000

USER node

CMD ["npm", "run", "dev"]
