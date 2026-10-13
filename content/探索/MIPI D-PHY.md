---
publish: true
permalink: /探索/MIPI D-PHY.md
title: MIPI D-PHY
created: 2024-03-25
modified: 2026-10-13T02:30:16.724Z
published: 2024-03-25
tags:
  - 溯源
socialImage: MIPI D-PHY.jpeg
---

## 简述

> 💡 D-PHY 中的这个 D ，在罗马数字中代表了“500”，那么 D-PHY 含义就是 500-PHY，也就是这个PHY最初设计是跑 500MHz，由于是 DDR的时钟，所以理论上就是 1Gbps/per Lane 的速率

![[探索/assets/MIPI D-PHY-35.png]]

## 硬件结构

### Lane模型

一个 D-PHY 包含<u>_一个时总通道_</u>模块和<u>_一个或多个数据通道_</u>模块。

这些 D-PHY 通道模块中的每一个都通过<u>_两条线路_</u>与通道互联另一侧的互补部分进行通讯。

一个通用的 D-PHY 包含了：
\- LP-TX
\- LP-RX
\- HS-TX
\- HS-RX
\- LP-CD

最后对外接口是 `Dp `和 `Dn`（差分信号）

其中，HS-TX、HS-RX 即为 High-Speed 模式，该模式下`Dp`和`Dn`为差分信号，使能端接；

其中，LP-TX、LP-RX、LP-CD 即为 Low-Power 模式，该模式下`Dp`和`Dn`则非差分信号，也关闭端接。

> `D-PHY` 至少由一条 `Clock Lane` 和 `Data Lane` 组成
> ![[探索/assets/MIPI D-PHY-36.png]]
>
> 值得一说的是，Master 需要一个 PLL 时钟乘法器来生成高频时钟。
>
> D-PHY规范使用架构模型，其中PHY外部的单独时钟乘法器单元为PHY生成所需的高频时钟信号，该时钟由开发者决定
>
> ![[探索/assets/MIPI D-PHY-37.png]]

![[探索/assets/MIPI D-PHY-38.png]]

---

> [!note]+ 官方文档
>
> ## 简介
>
> This specification provides a flexible, low-cost, High-Speed serial interface solution for communication interconnection between components inside a mobile device. Traditionally, these interfaces are CMOS parallel busses at low bit rates with slow edges for EMI reasons. The D-PHY solution enables significant extension of the interface bandwidth for more advanced applications. The D-PHY solution can be realized with very low power consumption
>
> 该规范为移动设备内部组件之间的通信互连提供了灵活、低成本、高速串行接口解决方案。 传统上，这些接口是低比特率的 CMOS 并行总线，由于 EMI 原因，边缘速度较慢。 D-PHY 解决方案可显着扩展接口带宽，以适应更高级的应用。 D-PHY 解决方案可以以极低的功耗实现
>
> ### Scope (应用范围)
>
> The scope of this document is to specify the lowest layers of High-Speed source-synchronous interfaces to be applied by MIPI Alliance application or protocol level specifications. This includes the physical interface, electrical interface, low-level timing and the PHY-level protocol. These functional areas taken together are known as D-PHY.
>
> 本文件的范围是规定 MIPI 联盟应用或协议级规范所应用的高速源同步接口的最底层。 这包括物理接口、电气接口、底层定时和物理层协议。这些功能区 合起来称为 D-PHY。
>
> ### 目的
>
> The  D-PHY  specification  is  used  by  manufacturers  to  design  products  that  adhere  to  MIPI  Alliance  interface specifications for mobile device such as, but not limited to, camera, display and unified protocol  interfaces.
>
> Implementing  this  specification  reduces  the  time-to-market  and  design  cost  of  mobile  devices  by  standardizing the interface between products from different manufacturers. In addition, richer feature sets requiring high bit rates can be realized by implementing this specification. Finally, adding new features to  mobile devices is simplified due to the extensible nature of the MIPI Alliance Specifications.
>
> 制造商使用 D-PHY 规范设计符合 MIPI 联盟移动设备接口规范的产品，例如（但不限于）摄像头、显示屏和统一协议接口。
> 通过标准化不同制造商产品之间的接口，实施该规范可缩短移动设备的上市时间并降低设计成本。此外，通过实施本规范，还可以实现需要高比特率的更丰富的功能集。最后，为移动设备添加新功能  最后，由于 MIPI 联盟规范的可扩展性，为移动设备增加新功能也变得简单。
>
> ## Overview （概述）
>
> D-PHY describes a source synchronous, high speed, low power, low cost PHY, especially suited for mobile  applications. This D-PHY specification has been written primarily for the connection of camera and display applications to a host processor. Nevertheless, it can be applied to many other applications. It is envisioned that the same type of PHY will also be used in a dual-simplex configuration for interconnections in a more generic communication network. Operation and available data-rates for a Link are asymmetrical due to a Master-Slave relationship between the two sides of the Link. The asymmetrical design significantly reduces the  complexity  of  the  Link.  Some  features  like  Bi-directional,  half-duplex  operation  are  optional.
>
> Exploiting this feature is attractive for applications that have asymmetrical data traffic requirements and when the cost of separate interconnects for a return channel is too high. While this feature is optional, it avoids mandatory overhead costs for applications that do not have return traffic requirements or want to apply physically distinct return communication channels.
>
> D-PHY 描述了一种源同步、高速、低功耗、低成本的 PHY，特别适用于移动应用。本 D-PHY 规范主要针对相机和显示应用与主机处理器的连接而编写。不过，它也可应用于许多其他应用。根据设想，同一类型的 PHY 也将以双复用配置的方式用于更通用的通信网络互连。由于链路两端的主从关系，链路的运行和可用数据速率是不对称的。非对称设计大大降低了链路的复杂性。 双向、半双工操作等一些功能是可选的。
> 对于有非对称数据流量要求的应用，以及回传通道的独立互连成本过高时，利用这一功能很有吸引力。虽然这一功能是可选的，但对于没有回传流量要求或希望应用物理上不同的回传通信信道的应用来说，它可以避免强制性的开销成本。
