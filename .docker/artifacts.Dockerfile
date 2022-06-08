FROM node:14 as artifacts
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build:frontend
RUN npm run build:backend
