---
title: DRM视频输出框架
publish: true
tags:
- 溯源
cover: DRM视频输出框架.jpeg
created: '2023-07-26'
publishDate: '2023-07-26'
modified: '2023-07-26'
lang: zh-CN
comments: true
description: ''
---

> DRM 全称是 Direct Rendering Manager， 进行显示输出管理、 buffer 分配、 帧缓冲。

DRM 全称是 **Direct Rendering Manager**， 进行显示输出管理、 buffer 分配、 帧缓冲。 对应 `userspace `库为 `libdrm`,， `libdrm `库提供了一系列友好的控制封装， 使用户可以方便的进行显示的控制和 buffer 申请。 DRM 的设备节点为 “`/dev/dri/cardX`”， X 为 0-15 的数值， 默认使用的是 /` dev/dri/card0`。

从 `linux 4.4` 内核开始， `Rockchip `显示驱动全部切到 `DRM `显示框架。

| 名称 | 含义 | 备注 |
| --- | --- | --- |
| `CRTC` | 显示控制器 | 在 `rockchip `平台是 `SOC `内部 `VOP`(部分文档也称为 `LCDC`) 模块的抽象 |
| `Plane` | 图层 | 在 `rockchip `平台是 `SOC `内部 `VOP`(`LCDC`) 模块 `win `图层的抽象 |
| `Encoder` | 输出转换器 | 指 `RGB`、 `LVDS`、 `DSI`、 `eDP`、 `HDMI`、 `CVBS`、 `VGA `等显示接口 |
| `Connector` | 连接器 | 指 encoder 和 panel 之间交互的接口部分 |
| `Bridge` | 桥接设备 | 一般用于注册 `encoder `后面另外再接的转换芯片， 如 `DSI2HDMI `转换芯片 |
| `Panel` | 泛指屏 | 各种 LCD、 HDMI 等显示设备的抽象 |
| `GEM` | `buffer `管理和分配 | 类似 `android `下的 ion |

![[探索/assets/DRM视频输出框架-e38c2502-2e1a-416d-a1bb-ef7069a60c5a.png]]

![[探索/assets/DRM视频输出框架-c7ed4a62-438b-4353-85ea-9df0f51d4ded.png]]

![[探索/assets/DRM视频输出框架-3.png]]

![[探索/assets/DRM视频输出框架-1415b389-1797-4640-a47a-705249c3ca5a.png]]

![[探索/assets/DRM视频输出框架-f20fa729-a77e-4ece-98bb-034d0b9e63cc.png]]

| Driver | File | Doc |
| --- | --- | --- |
| Core | rockchip\_drm\_drv.c | rockchip-drm.txt or rockchip-drm.yaml |
| - | rockchip\_drm\_fb.c | - |
| - | rockchip\_drm\_fbdev.c | - |
| - | rockchip\_drm\_gem.c | - |
| - | rockchip\_drm\_logo.c | - |
| - | rockchip\_drm\_direct\_show.c | - |
| - | panel-simple.c | - |
| VOP | rockchip\_drm\_vop.c | rockchip-vop.txt or yaml |
| - | rockchip\_vop\_reg | - |
| - | rockchip\_drm\_vop2 | - |
| - | rockchip\_vop2\_reg | - |
| RGB | rockchip\_rgp.c | rockchip-rgp.txt |
| - | phy-rockchip-inno-video-combo-phy.c | - |

![[探索/assets/DRM视频输出框架-438.png]]

需要注意的是，DRM 驱动是一系列显示相关模块的驱动的结合，它包含了 backlight、panel、rgb、lvds、dsi、edp、hdmi、vop 等显示通路上的模块。只有这些相互依赖的模块都加载起来，整个 drm 系统才能启动成功。

因为这些复杂的依赖关系，在 drm 系统初始化的过程中，可能会出现某个资源暂时未就绪，而导致某个模块暂时无法顺利加载的情况，为了解决这种问题，drm 驱动利用 Linux 驱动中的`deferred probe`机制，当发现某个依赖的资源未就绪的时候，驱动返回 `-EPROBE_DEFER(-517)`，然后退出。 Linux kernel 会在稍后再次尝试加载这个驱动，直到依赖的资源就绪，驱动顺利加载为止。

在一颗 SOC 上，可能有多个 VOP， HDMI， eDP， DP， MIPI， Panel 模块，根据具体产品定义，一款产品可能只需要使用到其中一部分模块来组成显示通路。

具体使用哪些模块，以及这些模块之间如何衔接则通过 DTS 配置

在每一个支持 drm 显示功能的 soc 的核心 dtsi 里面，都会有`display_subsystem`节点。

该节点控制`rockchip_drm_drv.c`驱动加载

memory-region 控制 logo 显示 buffer 的分配和传递，该属性在系统启动是会在 u-boot 中被动态修改，然后传递给内核。

route\_xxx 节点 控制着各个接口开机 logo 功能是否开启

该节点描述 vop 硬件资源，控制着 vop 驱动的加载`rockchip_drm_vop.c / rockchip_drm_vop2.c`。
