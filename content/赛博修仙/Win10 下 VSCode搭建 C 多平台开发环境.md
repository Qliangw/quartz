---
title: Win10 下 VSCode搭建 C 多平台开发环境
date: 2024-03-25
publish: true
tags:
  - 工具
---

## 准备工具

1. Windows 平台电脑
2. VSCode [下载地址](https://code.visualstudio.com/download)
3. winlibs [下载地址](https://winlibs.com/)

### 关于winlibs版本

![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-50.png]]

- Win10 以前下载 MSVCRT
- Win10 以后下载 UCRT

### 关于线程库

![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-51.png]]

- POSIX 最为通用，推荐这个

## 环境配置

### 个人申明

- Win11
- 下载了`winlibs-x86_64-posix-seh-gcc-13.2.0-llvm-17.0.6-mingw-w64ucrt-11.0.1-r5.zip`

### 添加环境变量

> [!note]+ 详细步骤
>
> ![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-52.png]]
>
> 打开 PATH
>
> ![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-53.png]]
>
> 新建
>
> ![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-54.png]]

![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-55.png]]

其中 `make` 需要在 `\dev_envs\mingw64\bin` 修改 `mingw32-make` 为` make`

## VSCode插件

- `**C/C++**`
- `**C/C++ Extension Pack**`
- `**C/C++ Themes**`

## VSCode环境配置

## 测试

### 输出hello

```c
#include <stdio.h>

int main(void)
{
    printf("hello test\n");

    return 0;
}
```

### 编译

```bash
gcc main.c -o main
```

### 运行

```powershell
PS D:\linux\uart\tty_test> .\main.exe        
hello test
PS D:\linux\uart\tty_test>
```

## 其他

### 头文件有波浪线

![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-56.png]]

![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-57.png]]

添加头文件路径

```plain text
${workspaceFolder}/**
D:\sde\dev_envs\mingw64\include
D:\sde\dev_envs\mingw64\x86_64-w64-mingw32\include
```

解决，可以跳转

![[赛博修仙/assets/Win10 下 VSCode搭建 C 多平台开发环境-58.png]]

---

> [!note]+ 交叉编译
>
> ```plain text
> "D:/linux/dev_envs/aarch64-none-linux-gnu/include",
>                 "D:/linux/dev_envs/aarch64-none-linux-gnu/aarch64-none-linux-gnu/include",
>                 "D:/linux/dev_envs/aarch64-none-linux-gnu/aarch64-none-linux-gnu/libc/usr/include"
> ```
