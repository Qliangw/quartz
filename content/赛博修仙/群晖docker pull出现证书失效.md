---
publish: true
permalink: /赛博修仙/群晖docker pull出现证书失效.md
title: 群晖docker pull出现证书失效
created: 2024-07-04
modified: 2026-10-13T01:28:01.663Z
published: 2024-07-04
tags:
  - 折腾
socialImage: 群晖docker pull出现证书失效.jpeg
---

![[【Docker】局域网服务器如何拉取镜像 synced block]]

```c
mv /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt.bak && sudo curl -Lko /etc/ssl/certs/ca-certificates.crt https://curl.se/ca/cacert.pem && synoservice --restart pkgctl-Docker
```
