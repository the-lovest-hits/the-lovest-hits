ARG IMAGE
FROM ${IMAGE}
RUN ls -al /app
WORKDIR /runtime

RUN cd /runtime
RUN cp /app/node_modules ./node_modules
RUN cp /app/dist/apps/backend/* .

CMD ["node", "main.js"]
