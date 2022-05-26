ARG IMAGE
FROM ${IMAGE} as artifacts

FROM node:alpine
WORKDIR /app
COPY --from=artifacts /app/dist/apps/backend/ .
COPY --from=artifacts /app/package.json .
COPY --from=artifacts /app/package-lock.json .
RUN npm install --production

CMD ["node", "main.js"]
