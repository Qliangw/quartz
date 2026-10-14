---
title: bin文件-二进制文件怎么对比
publish: true
tags:
- 学习
cover: bin文件-二进制文件怎么对比.jpeg
created: '2024-08-22'
publishDate: '2024-08-22'
modified: '2024-08-22'
lang: zh-CN
comments: true
description: ''
---

## 遇到的场景

flash上存放着某个芯片的固件，该固件通过工具烧录进去

想通过linux 下的 spi-nor flash 驱动去读取该flash里的内容是否与原始固件一样，来验证烧录工具做了什么更改

## 方法

1. dts中使能spi通道，并添加子设备spi-flash@0x0节点（前提是spi-nor包含了该flash型号，不然要写个驱动）
2. 上电，系统安装一个mtd工具

```bash
sudo apt-get update
sudo apt-get install mtd-utils
```

3. 读取该flash上的固件

```bash
# 会读取flash上所有的内容，如果flash较大，且spi速率慢会花很长时间
nanddump /dev/mtd0 -o dump_file.bin

# 指定读取,比如要读取 374360 byte
dd if=/dev/mtd0 of=/path/to/read.bin bs=374360 count=1

# 指定读取,比如要读取 374360 byte, 起始地址0x10
dd if=/dev/mtd0 of=/path/to/read.bin bs=374360 count=1 skip=16
```

> [!note]+ **补充**
>
> > 在`dd`命令中，`count`参数指定要读取的块数。
> > 参数解释：
> >
> > - `bs=4096`：指定每个块的大小为4096字节（4KB）。
> > - `count=10`：指定读取10个块。
> > - `skip=0` 和 `skip=10`：指定跳过的块数，即从哪个块开始读取。
> >
> > 示例说明：
> >
> > ```shell
> > dd if=/dev/mtd0 of=output_part1.bin bs=4096 count=10 skip=0
> > ```
> >
> > - 该命令从`/dev/mtd0`的起始位置（`skip=0`）读取10个块，每个块大小为4096字节，总共读取`10 * 4096 = 40960`字节（即40KB）的数据，并将其保存到`output_part1.bin`文件中。
> >
> > ```shell
> > dd if=/dev/mtd0 of=output_part2.bin bs=4096 count=10 skip=10
> > ```
> >
> > - 该命令从`/dev/mtd0`的第11个块开始（`skip=10`），读取10个块的数据，总共读取40KB，并将其保存到`output_part2.bin`文件中。
> >
> > 总结：
> >
> > `count`参数决定了`dd`命令读取的数据量，具体数量由`count * bs`决定。

4. 获取到 `read.bin` 后对比原始固件

```bash
diff read.bin source.bin

# 如果不相同会提示：二进制文件 read.bin 和 source.bin 不同
```

5. 想定位哪里不同，怎么办

```bash
# 转换为hex文件
hexdump -C read.bin > read.hex
hexdump -C source.bin > source.hex

# diff 对比
diff read.hex source.hex
# 会显示不同的地方
# xxxx
```
