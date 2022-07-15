FROM node:14 as artifacts
WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
RUN npm run build:frontend
RUN npm run build:backend
