---
title: plane的安装
publish: true
tags:
- Docker
- 工具
cover: plane的安装.jpeg
created: '2025-03-17'
publishDate: '2025-03-17'
modified: '2025-03-17'
lang: zh-CN
comments: true
description: ''
---

## 创建专有虚拟网络

`docker network create my_bridge`

## 使用compose配置安装

```yaml
version: "3"

x-db-env: &db-env
  PGHOST: ${PGHOST:-plane-db}
  PGDATABASE: ${PGDATABASE:-plane}
  POSTGRES_USER: ${POSTGRES_USER:-plane}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-plane}
  POSTGRES_DB: ${POSTGRES_DB:-plane}
  POSTGRES_PORT: ${POSTGRES_PORT:-5432}
  PGDATA: ${PGDATA:-/var/lib/postgresql/data}

x-redis-env: &redis-env
  REDIS_HOST: ${REDIS_HOST:-plane-redis}
  REDIS_PORT: ${REDIS_PORT:-6379}
  REDIS_URL: ${REDIS_URL:-redis://plane-redis:6379/}

x-minio-env: &minio-env
  MINIO_ROOT_USER: ${AWS_ACCESS_KEY_ID:-access-key}
  MINIO_ROOT_PASSWORD: ${AWS_SECRET_ACCESS_KEY:-secret-key}

x-aws-s3-env: &aws-s3-env
  AWS_REGION: ${AWS_REGION:-}
  AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:-access-key}
  AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY:-secret-key}
  AWS_S3_ENDPOINT_URL: ${AWS_S3_ENDPOINT_URL:-http://plane-minio:9000}
  AWS_S3_BUCKET_NAME: ${AWS_S3_BUCKET_NAME:-uploads}

x-proxy-env: &proxy-env
  NGINX_PORT: ${NGINX_PORT:-80}
  BUCKET_NAME: ${AWS_S3_BUCKET_NAME:-uploads}
  FILE_SIZE_LIMIT: ${FILE_SIZE_LIMIT:-5242880}

x-mq-env: &mq-env # RabbitMQ Settings
  RABBITMQ_HOST: ${RABBITMQ_HOST:-plane-mq}
  RABBITMQ_PORT: ${RABBITMQ_PORT:-5672}
  RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-plane}
  RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-plane}
  RABBITMQ_DEFAULT_VHOST: ${RABBITMQ_VHOST:-plane}
  RABBITMQ_VHOST: ${RABBITMQ_VHOST:-plane}

x-live-env: &live-env
  API_BASE_URL: ${API_BASE_URL:-http://api:8000}

x-app-env: &app-env
  WEB_URL: ${WEB_URL:-http://localhost}
  DEBUG: ${DEBUG:-0}
  SENTRY_DSN: ${SENTRY_DSN}
  SENTRY_ENVIRONMENT: ${SENTRY_ENVIRONMENT:-production}
  CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}
  GUNICORN_WORKERS: 1
  USE_MINIO: ${USE_MINIO:-1}
  DATABASE_URL: ${DATABASE_URL:-postgresql://plane:plane@plane-db/plane}
  SECRET_KEY: ${SECRET_KEY:-60bp1da1z2ddcfa45cxl20p1scy5xbpf6d8c5a0geejgkzp2c5}
  AMQP_URL: ${AMQP_URL:-amqp://plane:plane@plane-mq:5672/plane}
  API_KEY_RATE_LIMIT: ${API_KEY_RATE_LIMIT:-60/minute}
  MINIO_ENDPOINT_SSL: ${MINIO_ENDPOINT_SSL:-0}

networks:
  plane_bridge:
    external: true
services:
  web:
    image: makeplane/plane-frontend:stable
    command: node web/server.js web
    container_name: plane-web
    restart: on-failure
    networks:
      - "plane_bridge"
    depends_on:
      - api
      - worker

  space:
    image: makeplane/plane-space:stable
    command: node space/server.js space
    container_name: plane-space
    restart: on-failure
    networks:
      - "plane_bridge"
    depends_on:
      - api
      - worker
      - web

  admin:
    image: makeplane/plane-admin:stable
    command: node admin/server.js admin
    container_name: plane-admin
    restart: on-failure
    networks:
      - "plane_bridge"
    depends_on:
      - api
      - web

  live:
    image: makeplane/plane-live:stable
    command: node live/dist/server.js live
    container_name: plane-live
    restart: on-failure
    networks:
      - "plane_bridge"
    environment:
      <<: [*live-env]
    depends_on:
      - api
      - web

  api:
    image: makeplane/plane-backend:stable
    command: ./bin/docker-entrypoint-api.sh
    container_name: plane-api
    restart: on-failure
    networks:
      - "plane_bridge"
    volumes:
      - /mnt/volume1/.root/docker/plane/logs_api:/code/plane/logs
    environment:
      <<: [*app-env, *db-env, *redis-env, *minio-env, *aws-s3-env, *proxy-env]
    depends_on:
      - plane-db
      - plane-redis
      - plane-mq
      
  worker:
    image: makeplane/plane-backend:stable
    command: ./bin/docker-entrypoint-worker.sh
    container_name: plane-worker
    restart: on-failure
    networks:
      - "plane_bridge"
    volumes:
      - /mnt/volume1/.root/docker/plane/logs_worker:/code/plane/logs
    environment:
      <<: [*app-env, *db-env, *redis-env, *minio-env, *aws-s3-env, *proxy-env]
    depends_on:
      - api
      - plane-db
      - plane-redis
      - plane-mq

  migrator:
    image: makeplane/plane-backend:stable
    command: ./bin/docker-entrypoint-migrator.sh
    container_name: plane-migrator
    restart: on-failure
    networks:
      - "plane_bridge"
    volumes:
      - /mnt/volume1/.root/docker/plane/logs_migrator:/code/plane/logs
    environment:
      <<: [*app-env, *db-env, *redis-env, *minio-env, *aws-s3-env, *proxy-env]
    depends_on:
      - plane-db
      - plane-redis

  # Comment this if you already have a database running
  plane-db:
    image: postgres:15.7-alpine
    command: postgres -c 'max_connections=1000'
    container_name: plane-db
    restart: on-failure
    networks:
      - "plane_bridge"
    environment:
      <<: *db-env
    volumes:
      - /mnt/volume1/.root/docker/plane/pgdata:/var/lib/postgresql/data

  plane-redis:
    image: valkey/valkey:7.2.5-alpine
    container_name: plane-redis
    restart: on-failure
    networks:
      - "plane_bridge"
    volumes:
      - /mnt/volume1/.root/docker/plane/redisdata:/data

  plane-mq:
    image: rabbitmq:3.13.6-management-alpine
    container_name: plane-mq
    restart: on-failure
    networks:
      - "plane_bridge"
    environment:
      <<: *mq-env
    volumes:
      - /mnt/volume1/.root/docker/plane/rabbitmq_data:/var/lib/rabbitmq

  # Comment this if you using any external s3 compatible storage
  plane-minio:
    image: minio/minio:latest
    command: server /export --console-address ":9090"
    container_name: plane-minio
    restart: on-failure
    networks:
      - "plane_bridge"
    environment:
      <<: *minio-env
    volumes:
      - /mnt/volume1/.root/docker/plane/uploads:/export

  # Comment this if you already have a reverse proxy running
  proxy:
    image: makeplane/plane-proxy:stable
    container_name: plane-proxy
    networks:
      - "plane_bridge"
    ports:
      - 53380:80
    environment:
      <<: *proxy-env
    restart: on-failure
    depends_on:
      - web
      - api
      - space

```

```yaml
APP_DOMAIN=localhost
APP_RELEASE=stable

WEB_REPLICAS=1
SPACE_REPLICAS=1
ADMIN_REPLICAS=1
API_REPLICAS=1
WORKER_REPLICAS=1
BEAT_WORKER_REPLICAS=1
LIVE_REPLICAS=1

NGINX_PORT=80
WEB_URL=http://${APP_DOMAIN}
DEBUG=0
SENTRY_DSN=
SENTRY_ENVIRONMENT=production
CORS_ALLOWED_ORIGINS=http://${APP_DOMAIN}
API_BASE_URL=http://api:8000

#DB SETTINGS
PGHOST=plane-db
PGDATABASE=plane
POSTGRES_USER=plane
POSTGRES_PASSWORD=plane
POSTGRES_DB=plane
POSTGRES_PORT=5432
PGDATA=/var/lib/postgresql/data
DATABASE_URL=

# REDIS SETTINGS
REDIS_HOST=plane-redis
REDIS_PORT=6379
REDIS_URL=

# RabbitMQ Settings
RABBITMQ_HOST=plane-mq
RABBITMQ_PORT=5672
RABBITMQ_USER=plane
RABBITMQ_PASSWORD=plane
RABBITMQ_VHOST=plane
AMQP_URL=

# Secret Key
SECRET_KEY=60bp1da1z2ddcfa45cxl20p1scy5xbpf6d8c5a0geejgkzp2c5

# DATA STORE SETTINGS
USE_MINIO=1
AWS_REGION=
AWS_ACCESS_KEY_ID=access-key
AWS_SECRET_ACCESS_KEY=secret-key
AWS_S3_ENDPOINT_URL=http://plane-minio:9000
AWS_S3_BUCKET_NAME=uploads
FILE_SIZE_LIMIT=5242880

# Gunicorn Workers
GUNICORN_WORKERS=1

# UNCOMMENT `DOCKER_PLATFORM` IF YOU ARE ON `ARM64` AND DOCKER IMAGE IS NOT AVAILABLE FOR RESPECTIVE `APP_RELEASE`
# DOCKER_PLATFORM=linux/amd64

# Force HTTPS for handling SSL Termination
MINIO_ENDPOINT_SSL=0

# API key rate limit
API_KEY_RATE_LIMIT="60/minute"
```

```yaml
failed to deploy a stack: time="2025-03-17T02:00:50Z" level=warning msg="The \"SENTRY_DSN\" variable is not set. Defaulting to a blank string." time="2025-03-17T02:00:50Z" level=warning msg="The \"SENTRY_DSN\" variable is not set. Defaulting to a blank string." time="2025-03-17T02:00:50Z" level=warning msg="The \"SENTRY_DSN\" variable is not set. Defaulting to a blank string." time="2025-03-17T02:00:50Z" level=warning msg="The \"SENTRY_DSN\" variable is not set. Defaulting to a blank string." service "plane-db" refers to undefined network plane-bridge: invalid compose project
```
