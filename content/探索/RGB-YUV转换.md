---
publish: true
permalink: /探索/RGB-YUV转换.md
title: RGB-YUV转换
created: 2023-07-25
modified: 2026-10-13T01:28:00.363Z
published: 2023-07-25
tags:
  - 溯源
socialImage: RGB-YUV转换.jpeg
---

## 编码方式

## 转换

`YUV`与`RGB`的转换公式

U和V可以被表示成原始的R、G、B(R,G,B为[γ预校正后](/d36c399c9a5349b1b54130071a4fcef5)的)

$$
 \begin{aligned}Y &=0.299 * R + 0.587 * G + 0.114 * B \\[3ex] U &= -0.169*R-0.331*G+0.5*B+128 \\[3ex] V &=0.5*R-0.419*G-0.081*B+128 \end{aligned}
$$

如一般顺序，转移元件的范围可得到

$$
\begin{aligned}&Y\in[0,255] \\[2ex]
&U\in[0,255] \\[2ex]
&V\in[0,255]\end{aligned}
$$

再逆转关系上，从`YUV`到`RGB`，可得

$$
\begin{aligned}
R &= Y + 1.13983*(V-128)\\
G &= Y - 0.39465*(U-128)-0.58060*(V-128)\\
B &= Y+2.03211*(U-128)
\end{aligned}
$$

取而代之，以矩阵表示法，可得到公式

$$
\begin{aligned}\begin{bmatrix}Y\\[2ex]U\\[2ex]V\\ \end{bmatrix}&=\begin{bmatrix}0.299& 0.587 & 0.114\\[2ex] -0.169 & -0.331 & 0.5\\[2ex] 0.5 & -0.419 & -0.081 \end{bmatrix} \begin{bmatrix}R\\[2ex] G\\[2ex] B\end{bmatrix} + \begin{bmatrix}0\\[2ex] 128\\[2ex] 128\end{bmatrix}\\[10ex] \begin{bmatrix}R\\[2ex]G\\[2ex]B\\ \end{bmatrix}&=\begin{bmatrix}1 &-0.00093&1.401687\\[2ex]1&-0.3437 & -0.71417\\[2ex]1& 1.77216 & 0.00099 \end{bmatrix} \begin{bmatrix}Y\\[2ex] U-128\\[2ex] V-128\end{bmatrix}\end{aligned}
$$

## YUV转RGB

将`YUV format`转换成简单的`RGB format`可以用浮点运算

### Y’UV444

大多数YUV格式平均使用的每像素位数都少于24bit

- YUV444，一格不删，即每4个Y，配上4个U还有4个V
- YUV422则是UV格式上减半，即每4个Y，配2个U和2个V
- YUV420则是UV上减1/4，即每4个Y，配1个U和1个V

这些公式都是NTSC standard

$$
\begin{aligned}Y' &= 0.299 * R + 0.587*G+0.114*B\\[2ex]U&=-0.147*R - 0.289*G+0.436*B\\[2ex]V&=0.615*R-0.515*G-0.100*B\end{aligned}
$$

在早起的非SIMD（non-SIMD）构造中，floating point arithmetic会比fixed-point arithmetic稍慢，所有一个替代公式如下：

$$
\begin{aligned}C&=Y'-16\\D&=U-128\\E&=V-128\end{aligned}
$$

使用前面的系数并且用clip()注明切割的值域是0至255，如下公式是从Y’UV到RGB（NTSC version）

$$
\begin{align*} & R=clip((298*C+409*E+128)>>8)\\ & G=clip((298*C-100*D-208*E+128)>>8)\\& B=clip((298*C+516*D+128)>>8)  \end{align*}
$$

> _注意：上述的公式多暗示为YCbCr，虽然成为YUV，但应该严格区分YUV和YCbCr这两个专有名词有时并非完全相同_

<https://zh.wikipedia.org/zh-hans/YUV>
