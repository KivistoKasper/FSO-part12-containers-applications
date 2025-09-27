# Server A

This directory is for the code and documentation of the _server A_. A starter Dockerfile has been added, it has some comments to get you started.

Server A acts as a consumer for at least the _aggregated-emote-data_ topic. You may want to consume also the _raw-emote-data_ topic. Consume the messages and publish those to each WebSocket client.

To get started you should run `npm init` in this directory to initialize the Node project. This will create a `package.json`-file, which is used to define the project's attributes, dependencies etc. You should next create the index.js file.

# Usage

This server will use [http](http://localhost:3000/api/events) for getting and pushing new events.
Run this with server with "npm install" and after that use "npm run dev".

!! Include .env file in the root of the server and add line PORT=3000, for the server to run in port 3000. !!

# Kafka integration

1. Run docker-compose.yml with "docker-compose up"

- Notice that this is for testing only. The kafka should be started elsewhere when we get there.

2. Run emote generator in it's own root with command "node index.js"
3. Lastly run server A with "npm run dev" in it's root.

Notice that when testing we use Kafka in docker container with is't port 9094 open exposed. This means that server A and emote generator user broker address "localhost:9094".

When this is containerized this broker address will be something like "<host>:9092".

# Websocket integration

When the frontend is being worked with, uncomment code from "eventsRouter.js" to start using websocket. There is a testing html file in the frontend directory to test the websocket. Use it by right clicking the html file and choose "open with browser".
