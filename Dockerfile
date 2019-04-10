FROM node:carbon

# Создать директорию app
WORKDIR /app

MAINTAINER Nanord nanord2@yandex.ru

RUN apt-get update

ADD ./package.json /app
ADD ./BE/package.json /app/BE
ADD ./BE/dist /app/BE
ADD ./BE/meta.json /app/BE
ADD ./BE/tsconfig.json /app/BE

WORKDIR /app
RUN yarn global add pm2
RUN cd /app && yarn install

CMD ["yarn", "start_pm2_docker"]