---
title: MIPI xPHY
date: '2024-01-13'
publish: true
tags:
- 溯源
cover: MIPI xPHY.jpeg
---

![[【Docker】局域网服务器如何拉取镜像 synced block]]

相关链接

## 简介

MIPI 接口广泛应用于摄像头和显示部分。

PHY 属于MIPI接口的底层部分，即物理层，其中涉及到物理连线、信号传输等。

MIPI 的 PHY 分为了 3 种

- [D-PHY](/5c4245ae23a14c6db438d2f573601ddd) ： 最先出来的，应用最广泛
- M-PHY ： 在D-PHY之后出来的，速度最快，基本没有应用场景
- [C-PHY](/6f546ff102bd4faa9690c2e01c3bb8c2) ：最后出来的，有一定的应用

![[探索/assets/MIPI xPHY-39.png]]

> 💡 注意： C-PHY 和 D-PHY 中的 C 和 D 不是 Camera 和 Display 的简写，只是 PHY的命名
>
> - D-PHY 可以接 CSI 成为摄像头端的 PHY ，可可以用在 DSI 作为 Display 的 PHY
> - C-PHY 也同D-PHY
