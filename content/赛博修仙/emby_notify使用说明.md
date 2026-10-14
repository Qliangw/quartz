---
publish: true
permalink: /赛博修仙/emby_notify使用说明.md
title: emby_notify使用说明
comments: true
lang: zh-CN
created: 2022-03-21
modified: 2022-03-21
published: 2022-03-21
tags:
  - 工具
socialImage: emby_notify使用说明.jpeg
---

<!-- Column 1 -->

## [我的主页](https://qliangw.notion.site/)

![](https://count.getloli.com/get/@:emby_notify)

<https://github.com/Qliangw/emby_notify>

<!-- Column 2 -->

## 更新

1. `git pull` 即可完成更新

## 使用前提

2. Linux系统环境
3. 申请[tmdb](https://www.themoviedb.org/?language=zh-CN)的api\_key【可选】

## 使用

[什么值得买-仔老师整理教程比较详细，请移步](https://post.smzdm.com/p/a7nqw5qd/)

---

4. 打开emby服务端的 【设置】→ 【插件】
5. 安装 [Emby Scripter-X](https://github.com/AnthonyMusgrove/Emby-ScripterX) 插件

> [!note]+ 图片示例
> ![[赛博修仙/assets/emby_notify使用说明-40.png]]

6. 下载该脚本库到本地，放到emby有权限读取到的位置
   1. git方式下载 `git clone https://github.com/Qliangw/emby_notify.git`
   2. 压缩包下载后解压

> [!note]+ 图片示例
> ![[赛博修仙/assets/emby_notify使用说明-41.png]]

7. 修改文件夹权限 `sudo chmod -R 755 /path/to/emby_notify`
8. 复制一份user.conf.default重命名为user.conf配置脚本参数

> [!note]+ 说明
> 9\. 企业微信[获取参数](https://note.youdao.com/ynoteshare/index.html?id=351e08a72378206f9dd64d2281e9b83b\&type=note&_time=1647870887974)
> 10\. [pushplus](https://www.pushplus.plus/)
> 11\.  bark 在ios客户端获取参数
> 12\. [tmdb](https://www.themoviedb.org/) 获取参数
> 13\. SELECT\_PIC参数，可以修改没有海报时的通知图片[参考这里](https://github.com/Qliangw/emby_notify#%E9%BB%98%E8%AE%A4%E6%8E%A8%E9%80%81%E5%9B%BE)
> 14\. PIC\_URLx 参数，可以自定义没有海报时通知图片，支持jpg和png格式的图片
>
> ```bash
> # 企业微信配置
> export CORPID=""
> export CORP_SECRET=""
> export AGENTID=""
> export MEDIA_ID=""
> export TOUSER=""
> # pushplus配置 
> export PUSHPLUS_TOKEN=""
> export PUSHPLUS_GROUP=""
> # 默认是wechat，可选【wechat/webhook/cp/mail】 详情：https://www.pushplus.plus/push1.html
> # 仅仅测试了wechat模式，其他未测试。
> export PUSHPLUS_CHANNEL="wechat"
> # bark配置 
> BARK_KEY=""
> # TMDB_API需要官网注册获取：https://www.themoviedb.org/
> export TMDB_API_KEY=""
> # 这里可以修改默认通知图片 0 1 2 3 4
> export SELECT_PIC=0
>
> # 自定义图片只需要PIC_URLx，其中x是大于10的正整数
> # 这里可以自定义默认通知图片
> export PIC_URL10=""
> export PIC_URL11=""
> export PIC_URL12=""
> export PIC_URL13=""
> export PIC_URL14=""
> ```

15. 配置好测试通知
    1. 进入emby\_notify目录
    2. 运行命令`sh notify.sh test`
    3. 查看日志` cat log.txt` 或者直接看通知内容
16. 配置Scripter-X

> [!note]+ 示例
> 17\. 登录成功
>
> ![[赛博修仙/assets/emby_notify使用说明-42.png]]
>
> 18. 开始播放
>
> ![[赛博修仙/assets/emby_notify使用说明-43.png]]

## 参数说明

| 功能 | 功能参数 | scriptx的参数 |
| --- | --- | --- |
| 登录失败 | LF | "%username%" "%device.remote.ipaddress%" "%password%" "%device.name%" |
| 登录成功 | LS | "%username%" "%device.remote.ipaddress%" "%device.name%" |
| 电影入库 | AM | "%item.name%（%item.productionyear%）" "%item.overview%" "%item.meta.tmdb%" |
| 剧集入库 | AT | "%series.name%" "%item.overview%" "%series.meta.tmdb%" "%season.number%" "%episode.number%" |
| 播放电影 | PM | "%username%" "%item.name%（%item.productionyear%）" "%item.meta.tmdb%" "%item.overview%" "%device.name%" "%playback.position.percentage%" |
| 播放剧集 | PT | "%username%" "%series.name%" "%series.meta.tmdb%" "%item.overview%" "%device.name%" "%playback.position.percentage%" "%season.number%" "%episode.number%" |
| 停止播放电影 | SM | "%username%" "%item.name%（%item.productionyear%）" "%item.meta.tmdb%" "%device.name%" |
| 停止播放剧集 | ST | "%username%" "%series.name%" "%series.meta.tmdb%" "%device.name%" "%season.number%" "%episode.number%" |
