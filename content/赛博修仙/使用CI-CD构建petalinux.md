---
title: 使用CI-CD构建petalinux
date: 2024-11-05
publish: true
tags:
- Docker
---

## 基础

- 配置petalinux环境

```c
petalinux@bb1824740530:~$ ls
install.exp  petalinux_installation_log  workdir
petalinux@bb1824740530:~$ cd workdir/
petalinux@bb1824740530:~/workdir$ ls
petalinux@bb1824740530:~/workdir$ ifconfig 
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.18.0.19  netmask 255.255.0.0  broadcast 172.18.255.255
        ether 02:42:ac:12:00:13  txqueuelen 0  (Ethernet)
        RX packets 30  bytes 4671 (4.6 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

petalinux@bb1824740530:~/workdir$ df -h
Filesystem                     Size  Used Avail Use% Mounted on
overlay                        915G  857G   12G  99% /
tmpfs                           64M     0   64M   0% /dev
shm                             64M     0   64M   0% /dev/shm
/dev/mapper/vgubuntu-root      915G  857G   12G  99% /etc/hosts
/dev/mapper/vgubuntu-lv_disk1  7.3T  1.3T  5.7T  19% /home/petalinux/workdir
tmpfs                           32G     0   32G   0% /proc/asound
tmpfs                           32G     0   32G   0% /proc/acpi
tmpfs                           32G     0   32G   0% /proc/scsi
tmpfs                           32G     0   32G   0% /sys/firmware
petalinux@bb1824740530:~/workdir$ git --verison
unknown option: --verison
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]
petalinux@bb1824740530:~/workdir$ git -verison 
unknown option: -verison
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]
petalinux@bb1824740530:~/workdir$ git -v
unknown option: -v
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]
petalinux@bb1824740530:~/workdir$ git --version
git version 2.25.1
petalinux@bb1824740530:~/workdir$ 
petalinux@bb1824740530:~/workdir$ git config --global user.name "test"
petalinux@bb1824740530:~/workdir$ git config --global user.email "test@testc.com"
petalinux@bb1824740530:~/workdir$ source /opt/petalinux/v2021.2/./
.gitignore        .nodistribute     .version-history  components/       doc/              etc/              settings.csh      settings.sh       tools/
petalinux@bb1824740530:~/workdir$ source /opt/petalinux/v2021.2/./settings.sh 
PetaLinux environment set to '/opt/petalinux/v2021.2'
WARNING: /bin/sh is not bash! 
bash is PetaLinux recommended shell. Please set your default shell to bash.
WARNING: This is not a supported OS
INFO: Checking free disk space
INFO: Checking installed tools
INFO: Checking installed development libraries
INFO: Checking network and other services
WARNING: No tftp server found - please refer to "UG1144 2021.2 PetaLinux Tools Documentation Reference Guide" for its impact and solution
petalinux@bb1824740530:~/workdir$ ls
vic_gitlab
petalinux@bb1824740530:~/workdir$ ssh-keygen -t rsa -C "test@test.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/petalinux/.ssh/id_rsa): 
Created directory '/home/petalinux/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/petalinux/.ssh/id_rsa
Your public key has been saved in /home/petalinux/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:7aml/FuIjgpRJGCzwfcn6Tiz2XjAljMcp7RctY9oCT8 test@test.com
The key's randomart image is:
+---[RSA 3072]----+
|o=. .            |
|..++   .         |
| .. o o .        |
|   = * o .       |
|  * % = S .      |
|   ^ E . + o     |
|  o % . . = .    |
|   = o + + .     |
|    o.. =.o.     |
+----[SHA256]-----+
petalinux@bb1824740530:~/workdir$ 
petalinux@bb1824740530:~/workdir$ 
petalinux@bb1824740530:~/workdir$ mv test_gitlab/home/petalinux/.ssh/id_rsa
id_rsa      id_rsa.pub  
petalinux@bb1824740530:~/workdir$ mv test_gitlab/home/petalinux/.ssh/id_rsa
mv: cannot open 'vic_gitlab' for reading: Permission denied
petalinux@bb1824740530:~/workdir$ ls -lah
total 12K
drwxr-xr-x 2 root      root      4.0K Nov  7 06:17 .
drwxr-xr-x 1 petalinux petalinux 4.0K Nov  7 06:18 ..
-rw------- 1 root      root      1.8K Nov  7 06:17 vic_gitlab
petalinux@bb1824740530:~/workdir$ cp test_gitlab/home/petalinux/.ssh/id_rsa.pub 
cp: cannot open 'vic_gitlab' for reading: Permission denied
petalinux@bb1824740530:~/workdir$ cp test_gitlab/home/petalinux/.ssh/id_rsa     
petalinux@bb1824740530:~/workdir$ ls
vic_gitlab
petalinux@bb1824740530:~/workdir$ rm test_gitlab
rm: cannot remove 'vic_gitlab': Permission denied
petalinux@bb1824740530:~/workdir$ ls
petalinux@bb1824740530:~/workdir$ ls /home/petalinux/.ssh/ -lah 
total 16K
drwx------ 2 petalinux petalinux 4.0K Nov  7 06:19 .
drwxr-xr-x 1 petalinux petalinux 4.0K Nov  7 06:18 ..
-rwxr-xr-x 1 petalinux petalinux 1.8K Nov  7 06:19 id_rsa
-rw-r--r-- 1 petalinux petalinux  570 Nov  7 06:18 id_rsa.pub
petalinux@bb1824740530:~/workdir$ chmod -x /home/petalinux/.ssh/id_rsa 
petalinux@bb1824740530:~/workdir$ ls /home/petalinux/.ssh/ -lah
total 16K
drwx------ 2 petalinux petalinux 4.0K Nov  7 06:19 .
drwxr-xr-x 1 petalinux petalinux 4.0K Nov  7 06:18 ..
-rw-r--r-- 1 petalinux petalinux 1.8K Nov  7 06:19 id_rsa
-rw-r--r-- 1 petalinux petalinux  570 Nov  7 06:18 id_rsa.pub
petalinux@bb1824740530:~/workdir$ git clone ssh://git@192.168.3.89:40089/esw/spruce/xlnx/project.git
fatal: could not create work tree dir 'project': Permission denied
petalinux@bb1824740530:~/workdir$ ls
petalinux@bb1824740530:~/workdir$ cd ..
petalinux@bb1824740530:~$ ls -lah
total 44K
drwxr-xr-x 1 petalinux petalinux 4.0K Nov  7 06:18 .
drwxr-xr-x 1 root      root      4.0K Nov  4 07:01 ..
-rw-r--r-- 1 petalinux petalinux  220 Feb 25  2020 .bash_logout
-rw-r--r-- 1 petalinux petalinux 3.7K Feb 25  2020 .bashrc
-rw-r--r-- 1 petalinux petalinux   48 Nov  7 06:15 .gitconfig
-rw-r--r-- 1 petalinux petalinux  807 Feb 25  2020 .profile
drwx------ 2 petalinux petalinux 4.0K Nov  7 06:19 .ssh
-rwxr-xr-x 1 petalinux petalinux  795 Nov  4 06:04 install.exp
-rw-r--r-- 1 petalinux petalinux 1018 Nov  4 07:04 petalinux_installation_log
drwxr-xr-x 2 root      root      4.0K Nov  7 06:20 workdir
petalinux@bb1824740530:~$ 
Display all 1075 possibilities? (y or n)
petalinux@bb1824740530:~$ cd workdir/
petalinux@bb1824740530:~/workdir$ ls
petalinux@bb1824740530:~/workdir$ mkdir petalinux
mkdir: cannot create directory 'petalinux': Permission denied
petalinux@bb1824740530:~/workdir$ ls
petalinux@bb1824740530:~/workdir$ ls -lah
total 8.0K
drwxrwxrwx 2 root      root      4.0K Nov  7 06:20 .
drwxr-xr-x 1 petalinux petalinux 4.0K Nov  7 06:18 ..
petalinux@bb1824740530:~/workdir$ mkdir petalinux
petalinux@bb1824740530:~/workdir$ 
Display all 1075 possibilities? (y or n)
petalinux@bb1824740530:~/workdir$ cd petalinux/
petalinux@bb1824740530:~/workdir/petalinux$ ls
petalinux@bb1824740530:~/workdir/petalinux$ git clone ssh://git@192.168.3.89:40089/esw/spruce/xlnx/project.git
Cloning into 'project'...
The authenticity of host '[192.168.3.89]:40089 ([192.168.3.89]:40089)' can't be established.
ECDSA key fingerprint is SHA256:WczDldsRHABioVaUPSA4B1JSn5dLUFLcnY5pKvesedk.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.3.89]:40089' (ECDSA) to the list of known hosts.
git@192.168.3.89: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
petalinux@bb1824740530:~/workdir/petalinux$ eval "$(ssh-agent -s)
> "
Agent pid 287
petalinux@bb1824740530:~/workdir/petalinux$ ssh-add ~/.ssh/
id_rsa       id_rsa.pub   known_hosts  
petalinux@bb1824740530:~/workdir/petalinux$ ssh-add ~/.ssh/id_rsa
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/home/petalinux/.ssh/id_rsa' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
petalinux@bb1824740530:~/workdir/petalinux$ chmod 600 ~/.ssh/id_rsa
petalinux@bb1824740530:~/workdir/petalinux$ ssh-add ~/.ssh/id_rsa
Identity added: /home/petalinux/.ssh/id_rsa (test@test.com)
petalinux@bb1824740530:~/workdir/petalinux$ 
petalinux@bb1824740530:~/workdir/petalinux$ 
petalinux@bb1824740530:~/workdir/petalinux$ ssh-add -l           
2048 SHA256:zmXsd/rDIlKFFKMGhAl78O8NBswNmFD6GCbX2phdpM4 test@test.com (RSA)
petalinux@bb1824740530:~/workdir/petalinux$ git clone ssh://git@192.168.3.89:40089/esw/spruce/xlnx/project.git
Cloning into 'project'...
remote: Enumerating objects: 725, done.
remote: Counting objects: 100% (644/644), done.
remote: Compressing objects: 100% (604/604), done.
remote: Total 725 (delta 338), reused 0 (delta 0), pack-reused 81
Receiving objects: 100% (725/725), 121.31 MiB | 8.59 MiB/s, done.
Resolving deltas: 100% (352/352), done.
petalinux@bb1824740530:~/workdir/petalinux$ 
petalinux@bb1824740530:~/workdir/petalinux$ 
petalinux@bb1824740530:~/workdir/petalinux$ ls
project
petalinux@bb1824740530:~/workdir/petalinux$ cd project/     
petalinux@bb1824740530:~/workdir/petalinux/project$ git switch eli-dev-yf1
Branch 'eli-dev-yf1' set up to track remote branch 'eli-dev-yf1' from 'origin'.
Switched to a new branch 'eli-dev-yf1'
petalinux@bb1824740530:~/workdir/petalinux/project$ cd project-spec/meta-user/recipes-apps/
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ git branch   
* eli-dev-yf1
  main
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ git branch -l
* eli-dev-yf1
  main
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ git branch -a
* eli-dev-yf1
  main
  remotes/origin/HEAD -> origin/main
  remotes/origin/develop
  remotes/origin/develop-rev2
  remotes/origin/develop-rev2-1084
  remotes/origin/develop-rev2-1084-app-pro
  remotes/origin/develop-rev2-app-pro
  remotes/origin/develop-rev2-tmp
  remotes/origin/develop-rev3
  remotes/origin/develop-rev3-1094-app-pro
  remotes/origin/develop-rev3-app-pro
  remotes/origin/develop-rev3-tmp
  remotes/origin/eli-dev-yf1
  remotes/origin/eli-feat-1005-fix
  remotes/origin/eli-feat-hdr-txi
  remotes/origin/eli-feat-rev2-app-pro
  remotes/origin/eli-feat-rev3-app-pro
  remotes/origin/eli-release-rev2
  remotes/origin/eli-release-rev3
  remotes/origin/eli-rev3-testFPGA1
  remotes/origin/eli-rev3-testFPGA2
  remotes/origin/evard-dev
  remotes/origin/main
  remotes/origin/test-rev3-1094
  remotes/origin/vic-dev
  remotes/origin/vic-dev-yf1
  remotes/origin/vic-fix-fpga
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ git switch dev
fatal: invalid reference: dev
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ git switch dev^C
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ cd ..
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user$ cd ..
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec$ git submodule init  
Submodule 'kernel' (ssh://git@192.168.3.89:40089/esw/spruce/xlnx/kernel.git) registered for path '../kernel'
Submodule 'project-spec/meta-user/recipes-apps' (ssh://git@192.168.3.89:40089/esw/spruce/xlnx/apps/recipes-apps.git) registered for path 'meta-user/recipes-apps'
Submodule 'u-boot' (ssh://git@192.168.3.89:40089/esw/spruce/xlnx/uboot.git) registered for path '../u-boot'
Submodule 'xsa' (ssh://git@192.168.3.89:40089/esw/spruce/xlnx/xsa.git) registered for path '../xsa'
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec$ git submodule update
Cloning into '/home/petalinux/workdir/petalinux/project/kernel'...
Cloning into '/home/petalinux/workdir/petalinux/project/project-spec/meta-user/recipes-apps'...
Cloning into '/home/petalinux/workdir/petalinux/project/u-boot'...
Cloning into '/home/petalinux/workdir/petalinux/project/xsa'...
Submodule path '../kernel': checked out 'ea8da6ced5c743545e3e0353b02a4b6b9036c9a3'
Submodule path 'meta-user/recipes-apps': checked out 'b53dada61cf496478d5c2ac90a5838e9bb11c814'
Submodule path '../u-boot': checked out '65c126970118f51af2d90acf2e97d52484ba0801'
Submodule path '../xsa': checked out '944552cf6876b5f8c8f2278302e316cfa6697e00'
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec$ cd meta-user/recipes-apps/
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ git switch dev
Previous HEAD position was b53dada apps: ps version: v1.0.0.19
Branch 'dev' set up to track remote branch 'dev' from 'origin'.
Switched to a new branch 'dev'
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user/recipes-apps$ cd ..
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec/meta-user$ cd ..
petalinux@bb1824740530:~/workdir/petalinux/project/project-spec$ cd ..
petalinux@bb1824740530:~/workdir/petalinux/project$ petalinux-build 
environment: line 106: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)
[INFO] Sourcing buildtools
environment: line 72: /opt/petalinux/v2021.2/components/yocto/buildtools/environment-setup-x86_64-petalinux-linux: No such file or directory
[INFO] Building project
petalinux-yocto: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)
petalinux-yocto: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)
[INFO] Generating Kconfig for project
ERROR: Failed to generate /home/petalinux/workdir/petalinux/project/build/misc/config/Kconfig.syshw
ERROR: Failed to Kconfig project
ERROR: Failed to build project. Check the /home/petalinux/workdir/petalinux/project/build/build.log file for more details...
petalinux@bb1824740530:~/workdir/petalinux/project$ 
```

## 网络配置

- 使用macvlan
- 使用host
- 使用bridge

## 测试环境

## 启用CI/CD
