---
publish: true
permalink: /探索/MIPI xPHY.md
title: MIPI xPHY
created: 2024-01-13
modified: 2026-10-13T02:25:28.604Z
published: 2024-01-13
tags:
  - 溯源
socialImage: MIPI xPHY.jpeg
---

## 简介

MIPI 接口广泛应用于摄像头和显示部分。

PHY 属于MIPI接口的底层部分，即物理层，其中涉及到物理连线、信号传输等。

MIPI 的 PHY 分为了 3 种

- [[探索/MIPI D-PHY|MIPI D-PHY]] ： 最先出来的，应用最广泛
- MIPI M-PHY ： 在D-PHY之后出来的，速度最快，基本没有应用场景
- [[探索/MIPI C-PHY|MIPI C-PHY]] ：最后出来的，有一定的应用

![[探索/assets/MIPI xPHY-39.png]]

> 💡 注意： C-PHY 和 D-PHY 中的 C 和 D 不是 Camera 和 Display 的简写，只是 PHY的命名
>
> - D-PHY 可以接 CSI 成为摄像头端的 PHY ，可可以用在 DSI 作为 Display 的 PHY
> - C-PHY 也同D-PHY
