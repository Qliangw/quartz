---
publish: true
permalink: /探索/ARM是什么.md
title: ARM是什么
comments: true
lang: zh-CN
created: 2023-07-31
modified: 2023-07-31
published: 2023-07-31
tags:
  - 溯源
socialImage: ARM是什么.jpeg
---

## ARM

ARM是一个公司，Advanced RISC Machines的缩写

RISC（Reduced Instruction Set Computer）

---

## ARM内核与架构

### ARM内核

- **ARM内核**：包括了寄存器组、指令集、总线、存储器映射规则、中断逻辑和调试组件等
  - 内核是ARM公司设计并以销售方式授权给芯片厂商使用的，ARM公司并不做芯片。
- \*\*外设部分：\*\*包括计时器、A/D转换器、存储器、I2C、UART、SPI、ROM。。。等等，完全由芯片厂商自己设计并与ARM内核衔接配套。

---

## ARM指令集架构

指令集的设计是处理器结构中最重要的一部分，用ARM的术语称之为ISA（Instruction Set Architecture）

指令集是CPU设计的灵魂，要想使用CPU只能通过这些指令集来操作

### ARM处理器架构发展概述

![[探索/assets/ARM是什么-62.png]]

- **ARMv6** 主要特性
  - **Thumb-2**：是对 32 位 ARM 指令集的扩充，它的目标是为了实现更高的代码密度
  - **TrustZone**：安全扩展，将物理资源隔离，分为 Secure world 和 Normal word ，处理器通过 SMC 指令，可以在两个世界之间切换。该扩展需要总线、 MMU 的支持，DDR、SRAM、外设等也需要不同的 IP 来做控制，以实现安全隔离
  - **SIMD**：这一代 SIMD 指令集依赖的向量寄存器，服用了 ARM 本身的通用寄存器。支持 8/16bit 整数，可以实现 4 个 8bit 整数或者 2 个 16bit 整数并行计算
- ARMv7 主要特性
  - 高级SIMD：在ARM v7-A架构中，ARM进一步发展自身的SIMD指令集，并命名为NEON。这一代的指令集，有32个64bit的NEON向量寄存器，同时也支持单精度浮点；
  - VFPv3/v4：浮点体系结构 (VFP) 为半精度、单精度和双精度浮点运算中的浮点操作提供硬件支持，符合 IEEE-754 标准，VFPv4相当于VPPv3主要增加了half-precision extension和乘加的指令。ARM的vfp可以实现为32个或16个double-word register，分别以VFPv3-D32和VFPv3-D16来表示。当NEON和VFP同时实现时，VFP只可以实现为VFP-D32；
  - LPAE（Large Physical Address Extension）：大地址扩展，一般为40位地址扩展，可以将寻址范围从2^32 4GB扩展到2^40 1TB，也有处理器后来扩展到44bit ；
  - Virtualization：在 Normal world 里面加入了一个新的CPU模式——HYP mode，需要MMU和GIC（中断控制器）分别提供IPA（Intermediate Physical Address）和虚拟中断的转发的支持。
- ARMv8 主要特性
  - Secure EL2：该特性Armv8.4-A引入，在Secure word增加了虚拟化支持；
  - PA（Pointer Authentication）：v8.3引入，增强安全，函数指针检查，CPU在执行函数跳转时检查函数指针是否正确(使用MAC算法),防止跳转指针被修改；
  - BTI（Branch Target Identifiers）：v8.5引入，对间接跳转的目标进行限制。与PA结合使用极大程度减少控制流攻击;
  - MTE（Memory Tagging Extension）：v8.5引入，内存区域进行标记，对保护区域访问必须使用具有相同标记的指针。可检测溢出、UAF类漏洞;
  - Scalar Floating Point：aarch64提供32个128-bit寄存器用于SIMD vector and scalar floating-point支持；aarch32提供32个64-bit寄存器用于SIMD vector and scalar floating-point支持；
  - Enhanced Crypto：v8一开始就增加了cryptography 指令，包括AES, SHA-1/SHA-256 等算法实现，又在v8.4增加了"SHA3/SHA512/SM3/SM4"的支持；
  - bfloat：v8.2引入，增加FP16数据处理指令
  - Vector Extensions：v8.2引入，Scalable Vector Extension（SVE）是arm AArch64架构下的下一代SIMD指令集，旨在加速高性能计算，允许vector从28到2048 bit长度可变
  - Improved virtualization support：v8.4引入
- ARMv9 主要特性
  - Improve Security：主要是引入了全新的CCA（confidential compute architecture，机密计算架构 ）架构。机密计算可以打造基于硬件的安全运行环境来执行计算，保护部分敏感数据和代码，甚至不受特权软件的影响，即使是具有最高权限的OS也无法影响。虽然OS可以决定何时运行，但应用程序位于独立的硬件保护内存区域，和系统中的一切是隔离的。这意味着就算应用感染了恶意软件，也不会传播给设备里的其他部分。
  - Digital Signal Processing & Machine Learning：在ARMv8.2中引入SVE，但它的问题在于，新的可变矢量长度SIMD指令集的第一次迭代的范围相当有限，并且更多地针对HPC工作负载，缺少了许多仍由NEON涵盖的更通用的指令。SVE2，旨在通过用所需指令补充新的可扩展SIMD指令集来解决此问题，以服务于类似DSP/ML等目前仍在使用NEON的工作负载。除了增加的各种现代SIMD功能外，SVE和SVE2的优势还在于其可变的向量大小，范围覆盖了128bits到2048bits，让其无论在什么硬件运行，都允许向量的可变粒度为128b。如果纯粹从向量处理和编程的角度来看，这意味着软件开发人员将只需要编译一次其代码，并且如果将来某个CPU带有本地的512b SIMD execution pipelines，该代码将能够充分利用单元的整个宽度。同样，相同的代码将能够在具有较低硬件执行宽度能力的保守设计上运行，这对于Arm设计从物联网、移动到数据中心的CPU而言至关重要。在保留Arm体系结构的32bits编码空间的同时，它还可以完成所有这些工作。然而类似X86这样的架构则需要根据矢量尺寸增加新的指令和扩展。

## ARM处理器分类

> [!note]+ ### ARM分类
>
> > ARM公司自 2004 年推出的 ARMv7 内核架构时，摒弃了以往 “ARM+数字” 这种命名方法（ARM11之前的处理器统称为经典处理器系列（老东西系列）），重新启用 Cortex 来命名，并且将 Cortex 系列细分三大类
> >
> > - Cortex-A`Application Processors` 应用处理器：面向 **性能密集型系统** 的应用处理器内核
> >   - 面向移动计算，智能手机，服务器等市场的的高端处理器。这类处理器运行在很高的时钟频率（超过 `1GHz`），支持像 `Linux`，`Android`，`MS Windows` 和移动操作系统等完整操作系统需要的内存管理单元（`MMU`）。如果规划开发的产品需要运行上述其中的一个操作系统，你需要选择 ARM应用处理器
> > - Cortex-R`Real-time Processors` 实时处理器： 面向 **实时应用** 的高性能内核
> >   - 面向实时应用的高性能处理器系列，例如硬盘控制器，汽车传动系统和无线通讯的基带控制。多数实时处理器不支持 `MMU`，不过通常具有 `MPU`、`Cache` 和其他针对工业应用设计的存储器功能。实时处理器运行在比较高的时钟频率（例如 `200MHz` 到 `>1GHz` ），响应延迟非常低。虽然实时处理器不能运行完整版本的 Linux 和 Windows 操作系统，但是支持大量的实时操作系统（`RTOS`）。
> > - Cortex-M`Microcontroller Processors` 微控制器处理器： 面向 \*\*各类嵌入式应用 \*\*的微控制器内核
> >   - 微控制器处理器通常设计成面积很小和能效比很高。通常这些处理器的流水线很短，最高时钟频率很低（虽然市场上有此类的处理器可以运行在 `200Mhz` 之上）。并且，新的 `Cortex-M`处理器家族设计的非常容易使用。因此，`ARM` 微控制器处理器在单片机和深度嵌入式系统市场非常成功和受欢迎
>
> - ARM老东西
>   - ARM7【ARMv4】
>   - ARM9【ARMv5】
>   - ARM11【ARMv6】
> - ARM Cortex系列
>   - Cortex-M
>     - Cortex-M0【ARMv7】`面向低成本和超低功耗深度嵌入应用的处理器`
>     - Cortex-M1【ARMv7】`针对FPGA设计优化的小处理器，利用FPGA上的存储器块实现紧耦合内存，和Cortex-M0有相同的指令集`
>     - Cortex-M3【ARMv7】`过渡的一个吧，性能不如M4，价格不如M0`
>     - Cortex-M4【ARMv7】`具备M3所有的功能，多了DSP数字信号的处理指令集，支持浮点运算`
>     - Cortex-M7【ARMv7】`针对高端微控制器，具备M4所有功能，支持双精度浮点运算，有扩展存储器的功能，例如Cache和紧耦合存储器TCM`
>     - Cortex-M23【ARMv8】`面向超低功耗，和M0相似，有一定增强，并且支持TrustZone安全扩展`
>     - Cortex-M33【ARMv8】`和M4处理器类似，性能更高，支持TrustZone安全扩展`
>   - Cortex-R
>     - Cortex-R4【ARMv7】
>     - Cortex-R5【ARMv7】
>     - Cortex-R7【ARMv7】
>     - Cortex-R8【ARMv7】
>     - Cortex-R52【ARMv7】
>   - Cortex-A
>     - Cortex-A5【ARMv7】
>     - Cortex-A7【ARMv7】
>     - Cortex-A8【ARMv7】
>     - Cortex-A9【ARMv7】
>     - Cortex-A15【ARMv7】
>     - Cortex-A53【ARMv8】
>     - Cortex-A57【ARMv8】
>     - Cortex-A73【ARMv8】
>     - Cortex-A75【ARMv8】
>     - Cortex-A510【ARMv9】
>     - Cortex-A710【ARMv9】
>     - Cortex-A715【ARMv9】
>     - Cortex-A720【ARMv9】
>     - Cortex-X 整体设计思路与A系列保持一致
>       - Cortex-X1【ARMv9】
>       - Cortex-X2【ARMv9】
>       - Cortex-X3【ARMv9】
>     - Neoverse`？TODO，待梳理`
> - Cortex-M SecureCore
> - ARM Neoverse

> [!note]+ ### Cortex-A系列演进关系
>
> ![[探索/assets/ARM是什么-63.png]]

- ## 超大核
- 大核
  - A8→A9→A15→A57→A72→A73→A75→A76→A77→A78→A710→A715
- 小核
  - A9→A7→A53→A55→73→A510
-

## ARM处理器设计团队

ARM处理器主要出自Austin、Sophia、Cambridge三个Team之手，主要处理器如下

- Austin (Texas)
  - Cortex-A8, Cortex-A15, Cortex-A57, Cortex-A72, Cortex-A76, Cortex-A77, Cortex-A78
  - Cortex-X1, Cortex-X2, Cortex-X3
  - Neoverse N1, Neoverse N2, Neoverse V1
- Sophia-Antipolis (France)
  - ARM11, Cortex-A9, Cortex-A12, Cortex-A17, Cortex-A73, Cortex-A75
- Cambridge (UK)
  - Cortex-A5, Cortex-A7, Cortex-A53, Cortex-A35, , Cortex-A55
    ![[探索/assets/ARM是什么-64.png]]

---

## 参考

- [尝试梳理下ARM处理器的发展历史 (qq.com)](https://mp.weixin.qq.com/s/JYcEHo9TmNCDA_LsYM3iHw)
- [List of ARM processors - Wikipedia](https://en.wikipedia.org/wiki/List_of_ARM_processors)
- [到底什么是Cortex、ARMv8、arm架构、ARM指令集、soc？一文帮你梳理基础概念【科普】 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/266092621)
