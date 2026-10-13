---
title: 群晖宿主机连通Docker
date: '2022-03-20'
publish: true
tags:
- 折腾
cover: 群晖宿主机连通Docker.jpeg
---

![[【Docker】局域网服务器如何拉取镜像 synced block]]

# 所需工具或设备

- 群晖（unraid不需要如此折腾，其他Linux没有试验，理论可行）
- ssh工具（putty、secureCRT【推荐】、MobaXterm【推荐】、FinalShell等）
- 电脑一台（win、mac、linux都行）

# 配置

通过ssh工具登录群晖

切换到root用户

## 查看当前网卡

键入命令 `ip a`

![[赛博修仙/assets/群晖宿主机连通Docker-86.png]]

找到这个网口，名称为`eth0` ，也有可能是`ovs_eth0`、`eth1`等等或者其他。

## 创建虚拟网卡

```bash
# 其中br0是一个macvlan模式桥接的网口名称
# eth0为上面通过ifconfig或者ip a命令查询到的网口名称
# 下面仅仅需要更改eth0即可（br0是名字，亦可自定义只是下面的都需要对应更改）
ip link add br0 link eth0 type macvlan mode bridge

# 为该接口分配ip, 这里的ip要和你的群晖在同一个网段
ip addr add 192.168.1.31 dev br0
# 启用br0
ip link set br0 up

# 修改路由，使宿主机到192.168.1.64/27的通信全部经由br0进行
# 这里仅允许30个IP(192.168.1.65-192.168.1.94)通过br0，其余默认eth0
ip route add 192.168.1.64/27 dev br0
```

至此，在宿主机的操作完成。

## Docker创建macvlan网络

```bash
# 其中 
# subnet是网段
# gateway是网关
# parent=br0 是前面创建的br0网口名称
# 最后一个br0是docker创建的macvlan的网络名称
docker network create -d macvlan \
--subnet=192.168.1.0/24 \
--gateway=192.168.1.254 -o parent=br0 br0
```

至此就配置完成，能够通过宿主机与docker创建的macvlan的容器通信了。

## 配置开机初始化

只是这样重启就失效。

有空再搞吧。。。咕咕咕

```bash
#!/bin/bash
# 其中br0是一个macvlan模式桥接的网口名称
# eth0为上面通过ifconfig或者ip a命令查询到的网口名称
# 下面仅仅需要更改eth0即可（br0是名字，亦可自定义只是下面的都需要对应更改）
ip link add br0 link eth0 type macvlan mode bridge

# 为该接口分配ip, 这里的ip要和你的群晖在同一个网段
ip addr add 192.168.1.31 dev br0
# 启用br0
ip link set br0 up

# 修改路由，使宿主机到192.168.1.64/27的通信全部经由br0进行
# 这里仅允许30个IP(192.168.1.65-192.168.1.94)通过br0，其余默认eth0
ip route add 192.168.1.64/27 dev br0
```

# 使用示例

创建一个transmission，测试连通性

```bash
# network 连接刚才的br0网络，ip固定在65-94之间。
docker run -d \
--network br0 \
--ip 192.168.1.65  \
-v /volume1/docker/tr_test/downloads:/downloads \
-v /volume1/docker/tr_test/watch:/watch \
-v /volume1/docker/tr_test/config:/config \
-e RPCPORT=9091 \
-e PEERPORT=51413 \
-e USER='transmission' \
-e PASS='transmission' \
docker.io/chisbread/transmission:latest
```

`ip link set enp0s8 promisc on`

ping

```yaml
version: "3"
networks:
  br0:
    external: true
services:
  tr_test:
    image: docker.io/chisbread/transmission:latest
    networks:
      br0:
        ipv4_address: 192.168.1.66
    container_name: transmission_test
    environment:
      - RPCPORT="9091"
      - PEERPORT="51413"
      - USER="transmission"
      - PASS="transmission"
    volumes:
      - "/volume1/docker/tr_test/downloads:/downloads"
      - "/volume1/docker/tr_test/watch:/watch"
      - "/volume1/docker/tr_test/config:/config"
```

```yaml
networks:
  br0:
    driver: macvlan
    driver_opts:
      parent: eth0
    ipam:
      driver: default
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.254
```

![[赛博修仙/assets/群晖宿主机连通Docker-87.png]]

---

# 参考资料

<https://docs.docker.com/network/macvlan/#use-an-ipvlan-instead-of-macvlan>

<https://aoyouer.com/posts/macvlan-host/>

<https://segmentfault.com/a/1190000022752866>

<https://www.kancloud.cn/chunyu/php_basic_knowledge/2137339>
