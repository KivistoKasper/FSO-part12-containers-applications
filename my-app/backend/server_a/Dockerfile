# small photo for maximum security
FROM node:20-slim

WORKDIR /usr/src/server_a

# Copy package.json and package-lock.json first (better for caching layers)
COPY package*.json ./

# install dependencies, omitting the development dependencies
RUN npm ci --omit=dev

# changing user not to root, if issue update docker or we can change this 
COPY --chown=node:node . .

USER node

CMD ["npm", "start"]
