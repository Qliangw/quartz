---
title: nginx+filebrowser搭建文件索引服务器
publish: true
tags:
- Docker
- 工具
cover: nginx+filebrowser搭建文件索引服务器.png
created: '2024-08-26'
publishDate: '2024-08-26'
modified: '2024-08-26'
lang: zh-CN
comments: true
description: ''
---

![[【Docker】局域网服务器如何拉取镜像 synced block]]

> [!note]+ 弃置
>
> ## 安装nginx
>
> ```bash
> version: '3'
> services:
>   nginx:
>     image: nginx:1.26.1
>     container_name: release-repo
>     ports:
>       - "50781:80"
>     volumes:
>       - /home/sv_mp1/releases:/usr/share/nginx/html/repo:ro
>       - /home/sv_mp1/docker/release-repo/nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
>     restart: always
> ```
>
> ## 安装lua及其依赖
>
> ```bash
> docker exec -it release-repo /bin/bash
>
> apt-get update
> apt-get install -y lua5.4 liblua5.4-dev
>
> apt-get python3 python3-pip
>
> pip3 install
> ```

## 思路

## 安装

docker-compose.yaml

```python
version: '3'
networks:
  portainer_bridge:
    external: true
services:
  filebrowser:
    image: 80x86/filebrowser:2.10.3-amd64
    container_name: releases-filebrowser
    networks:
      - "portainer_bridge"
    ports:
      - "50770:8082"
    volumes:
      - /home/sv_mp1/releases:/myfiles
      - /home/sv_mp1/docker/release-repo/filebrowser:/config
    environment:
      PUID: 0
      GUID: 0
    restart: always
  nginx:
    image: nginx:1.26.1
    container_name: releases-nginx
    networks:
      - "portainer_bridge"
    ports:
      - "50771:80"
    volumes:
      - /home/sv_mp1/releases:/disk0/repo:ro
      - /home/sv_mp1/docker/release-repo/nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: always
```

nginx.conf

```python
server {
    listen 80;
    server_name your.repo.server.com;

    location / {
        root /disk0/repo;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
```

## 使用

1. filebrowser管理文件
2. nginx有只读权限
3.
