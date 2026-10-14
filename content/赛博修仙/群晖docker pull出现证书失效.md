---
title: 群晖docker pull出现证书失效
publish: true
tags:
- 折腾
cover: 群晖docker pull出现证书失效.jpeg
created: '2024-07-04'
publishDate: '2024-07-04'
modified: '2024-07-04'
lang: zh-CN
comments: true
description: ''
---

![[【Docker】局域网服务器如何拉取镜像 synced block]]

```c
mv /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt.bak && sudo curl -Lko /etc/ssl/certs/ca-certificates.crt https://curl.se/ca/cacert.pem && synoservice --restart pkgctl-Docker
```
