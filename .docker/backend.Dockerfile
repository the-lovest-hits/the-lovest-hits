ARG IMAGE
FROM ${IMAGE}
WORKDIR /runtime
COPY /app/node_modules ./node_modules
COPY /app/dist/apps/backend/* .

CMD ["node", "main.js"]
