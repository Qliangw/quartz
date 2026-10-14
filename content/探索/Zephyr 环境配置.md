---
title: Zephyr 环境配置
publish: true
tags:
- 学习
cover: Zephyr 环境配置.jpeg
created: '2024-01-13'
publishDate: '2024-01-13'
modified: '2024-01-13'
lang: zh-CN
comments: true
description: ''
---

![[【Docker】局域网服务器如何拉取镜像 synced block]]

## 官方指导

<https://docs.zephyrproject.org/latest/develop/getting_started/index.html>

## 翻译

### 入门指南

跟着指南开始：

- 在Ubuntu、macOS或Windows上设置命令行Zephyr开发环境（其他Linux发行版的安装说明请参见“[安装Linux宿主依赖](https://docs.zephyrproject.org/latest/develop/getting_started/installation_linux.html#installation-linux)”）
- 获取源代码
- 构建、烧录并运行一个示例应用程序

### 选择和更新操作系统

- Ubuntu
  - 该指南适用于Ubuntu 20.04 LTS版本及更高版本

```javascript
sudo apt update
sudo apt upgrade
```

- macOS
- Windows

### 安装依赖

接下来，您将使用包管理器安装一些宿主依赖项。

主要依赖项当前的最低要求版本是：

| Tool | Min.Version |
| --- | --- |
| [CMake](https://cmake.org/) | 3.20.5 |
| [Python](https://www.python.org/) | 3.8 |
| [Devicetree compiler](https://www.devicetree.org/) | 1.4.6 |

- Ubuntu
  1. 如果使用的是早于22.04的Ubuntu版本，则需要添加额外的存储库以满足上述主要依赖项的最低要求版本。在这种情况下，下载、检查并执行Kitware档案脚本，将Kitware APT存储库添加到您的源列表中。有关kitware-archive.sh的详细说明，请查看 [kitware第三方apt存储库](https://apt.kitware.com/)。

```javascript
wget https://apt.kitware.com/kitware-archive.sh
sudo bash kitware-archive.sh
```

```
2. 使用apt安装所需的依赖项：
```

```javascript
sudo apt install --no-install-recommends git cmake ninja-build gperf \
  ccache dfu-util device-tree-compiler wget \
  python3-dev python3-pip python3-setuptools python3-tk python3-wheel xz-utils file \
  make gcc gcc-multilib g++-multilib libsdl2-dev libmagic1
```

```
3. 通过输入以下命令验证您系统上安装的主要依赖项的版本：
```

```javascript
cmake --version
python3 --version
dtc --version
```

```
    将这些版本与本节开头表格中的版本进行对比。如需了解如何手动更新依赖项的更多信息，请参阅“安装Linux宿主依赖”页面。
```

- macOS
- Windows

### 获取Zephyr并安装Python依赖项

接下来，克隆Zephyr及其模块到一个名为zephyrproject的新的west工作区。您还将安装Zephyr的额外Python依赖项。

> 在系统或用户级别安装依赖项时，很容易遇到Python包的不兼容问题。例如，如果在同一台机器上处理多个Zephyr版本或使用Python的其他项目，就可能发生这种情况。
> 出于这个原因，建议使用[Python虚拟环境](https://docs.python.org/3/library/venv.html)。

- 安装虚拟环境
  1\.
- 安装全局环境
