FROM node:carbon

# Создать директорию app
WORKDIR /app

MAINTAINER Nanord nanord2@yandex.ru

RUN apt-get update

ADD ./ /app

WORKDIR /app
RUN yarn global add pm2
RUN cd /app && yarn install

CMD ["yarn", "start_pm2_docker"]