---
aliases: []
author:
  - BG6LH
category:
  - Posts
image: http://mmbiz.qpic.cn/mmbiz_jpg/8havQfBUHozbKcHYtbjXF1IibYI3BM8QRuEKXS3YWxA5MAE52UfKyzu0cfI4sbib6kVNOyw3965aMy49V6fqEywg/0?wx_fmt=jpeg
description: 我尝试用dfu-util在mac上刷NanoVNA固件，刷机成功。以下是我分享的心得。
imageNameKey: how-to-flash-nanovna-firmware-on-macos-using-dfu-util
permalink: /blog/how-to-flash-nanovna-firmware-on-macos-using-dfu-util/
date: 2019-08-06 16:42:00
source: https://mp.weixin.qq.com/s/h29UM2iwV9cKt8FxdvI-6w
tags:
  - dfu-util
  - macOS
  - nanoVNA
title: 在mac上用dfu-util更新NanoVNA的固件
---

我只有Mac的机器，装了个虚拟机刷NanoVNA的固件总是失败。 于是转投了Mac和linux上常用的刷固件软件： dfu-util。

<!--more-->

这个软件兼容的芯片很多，nanoVNA用的STM32也是支持的。

软件网站在这： [http://dfu-util.sourceforge.net/](http://dfu-util.sourceforge.net/)

使用手册在这： [http://dfu-util.sourceforge.net/dfu-util.1.html](http://dfu-util.sourceforge.net/dfu-util.1.html)

## 安装 dfu-util

在Mac上安装dfu-util很简单，只要在“终端”(Terminal)程序下运行：

```zsh
brew install dfu-util
```
然后系统会自动安装。

也可能会要求先更新homebrew，没问题，等他自己更新就行了。

## 短路开机 NanoVNA

连接好USB线到电脑，短路中间绿色板子上的BOOT0和VDD两个点，然后开机，机器进入booterloader模式，白屏。此时Mac应该改自己就识别出来了STM32的bootloader，不用安装任何驱动。

注：短路只在开机时短一下即可，不用一直短路。

## 确认哪个是 nanoVNA

Mac的蓝牙控制器也是一个dfu设备，所以，一定要先确认一下，哪个是nanoVNA的bootloader，不能搞错。。

执行：
```zsh
dfu-util -l
```


然后会列出一堆设备信息：

```zsh
dfu-util 0.9

Copyright 2005-2009 Weston Schmidt, Harald Welte and OpenMoko Inc.
Copyright 2010-2016 Tormod Volden and Stefan Schmidt
This program is Free Software and has ABSOLUTELY NO WARRANTY
Please report bugs to http://sourceforge.net/p/dfu-util/tickets/

Found Runtime: [05ac:8290] ver=0167, devnum=2, cfg=1, intf=5, path="20-8", alt=0, name="UNKNOWN", serial="UNKNOWN"
Found DFU: [0483:df11] ver=2200, devnum=16, cfg=1, intf=0, path="20-1", alt=1, name="@Option Bytes  /0x1FFFF800/01*016 e", serial="FFFFFFFEFFFF"
Found DFU: [0483:df11] ver=2200, devnum=16, cfg=1, intf=0, path="20-1", alt=0, name="@Internal Flash  /0x08000000/064*0002Kg", serial="FFFFFFFEFFFF"
```


`[05ac:8290]` 这个设备就是Mac的蓝牙控制器。

`[0483:df11]`才是我们要写入的那个 STM的bootloader。记住这个ID，`0483:df11`。



## 向 nanoVNA 写入固件文件

使用刚才查到的ID，执行命令：

```zsh
dfu-util -v -d 0483:df11 -a 0 -D <下载文件所在的目录>/nanoVNA_900_aa_20190802.dfu
```

然后就等吧，屏幕上会出现哗哗哗的刷机信息，直到最后显示：

```zsh
done parsing DfuSe file
```

  

然后拔掉电源重新开机，重新校准NanoVNA，就好了。

  

  

## 后记

- 我的刷机环境：macOS Mojave 10.14.5 ，其它机器没试验过，应该问题不大。
- NanoVNA不怕刷成砖，刷坏了再刷就行。
- Linux和树莓派也可以装dfu-util。

---
原文发表在我的微信公众号上： [https://mp.weixin.qq.com/s/h29UM2iwV9cKt8FxdvI-6w](https://mp.weixin.qq.com/s/h29UM2iwV9cKt8FxdvI-6w)