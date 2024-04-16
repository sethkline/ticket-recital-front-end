FROM node:18.13-alpine
WORKDIR /my-nuxt-app
COPY . /my-nuxt-app
RUN npm ci
RUN nuxt build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]