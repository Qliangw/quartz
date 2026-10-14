---
publish: true
permalink: /赛博修仙/群晖docker pull出现证书失效.md
title: 群晖docker pull出现证书失效
comments: true
lang: zh-CN
created: 2024-07-04
modified: 2024-07-04
published: 2024-07-04
tags:
  - 折腾
socialImage: 群晖docker pull出现证书失效.jpeg
---

```c
mv /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt.bak && sudo curl -Lko /etc/ssl/certs/ca-certificates.crt https://curl.se/ca/cacert.pem && synoservice --restart pkgctl-Docker
```
