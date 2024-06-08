FROM --platform=linux/amd64 node:20.11.0-alpine AS base

# 패키지 업데이트 및 Python3, g++, make 설치
RUN apk update && apk add --no-cache python3 g++ make

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.build.json .
COPY tsconfig.json .

RUN node --version

# npm install 실행 전 Python 심볼릭 링크 추가
RUN ln -sf /usr/bin/python3 /usr/bin/python

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000
ENTRYPOINT [ "npm", "run", "start:prod" ]
