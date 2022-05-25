ARG IMAGE
FROM ${IMAGE}
WORKDIR /runtime
COPY /app/node_modules ./node_modules
COPY /app/dist/apps/the-lovest-hits .

CMD ["npm", "start"]
