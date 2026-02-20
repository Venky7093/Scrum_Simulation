FROM node

WORKDIR  app/

COPY ..

PORT : 8080

CMD  ["npm install", "start"]
