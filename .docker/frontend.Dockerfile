ARG IMAGE
FROM ${IMAGE} as artifacts

FROM node:alpine
WORKDIR /runtime
COPY --from=artifacts /app/dist/apps/the-lovest-hits/ .
RUN npm install
CMD ["npm", "start"]
