ARG IMAGE
FROM ${IMAGE}
WORKDIR /runtime

RUN cd /runtime
RUN cp /app/node_modules ./node_modules
RUN cp /app/dist/apps/the-lovest-hits .

CMD ["npm", "start"]
