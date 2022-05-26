ARG IMAGE
FROM ${IMAGE}
WORKDIR /runtime

RUN cd /runtime
RUN mv /app/node_modules ./node_modules
RUN mv /app/dist/apps/the-lovest-hits/* .

CMD ["npm", "start"]
