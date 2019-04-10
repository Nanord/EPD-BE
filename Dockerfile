FROM node:carbon

# Создать директорию app
WORKDIR /app

MAINTAINER Nanord nanord2@yandex.ru

RUN apt-get update

# Если yarn не установлен то:
#   wget https://yarnpkg.com/latest.tar.gz
#    FROM risingstack/alpine:3.4-v6.7.0-4.0.0
#    WORKDIR /opt/app
#    # Install yarn from the local .tgz
#    RUN mkdir -p /opt
#    ADD latest.tar.gz /opt/
#    RUN mv /opt/dist /opt/yarn
#    ENV PATH "$PATH:/opt/yarn/bin"
#    # Install packages using Yarn
#    ADD package.json /tmp/package.json
#    RUN cd /tmp && yarn
#    RUN mkdir -p /opt/app && cd /opt/app && ln -s /tmp/node_modules

ADD . /app
WORKDIR /app
RUN cd /app && yarn install

CMD ["yarn", "start_pm2"]