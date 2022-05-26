ARG IMAGE
FROM ${IMAGE}
RUN ls -al /app
WORKDIR /runtime

RUN cd /runtime
RUN mv /app/node_modules ./node_modules
RUN mv /app/dist/apps/backend/* .

CMD ["node", "main.js"]
