# Hellō Client Dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./src ./
RUN npm i --only=production
COPY ../package.json package-version.json
# default client port
EXPOSE 8000
ENV IP=0.0.0.0
CMD ["npm", "start"]
