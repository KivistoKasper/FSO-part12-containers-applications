# laitetaa pienempi kuva sit ku voi testata minkä kokonen riittää
FROM node:20-slim

# "the Express documentation outlines the importance of setting this environment variable for enabling performance and security related optimizations"
ENV NODE_ENV production

WORKDIR /usr/src/server_b

# copy package.json and package-lock.json first (better for caching layers)
COPY package*.json ./

# install dependencies, omitting the development dependencies
RUN npm ci --omit=dev

# rebuild sqlite3 for compatibility inside Docker
RUN npm rebuild sqlite3

# changing user not to root
COPY --chown=node:node . .

USER node

CMD ["npm", "start"]
