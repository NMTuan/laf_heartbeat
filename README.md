# laf_heartbeat

一个基于 Laf 的云函数心跳服务。



## 更新日志

[详见 release](https://github.com/NMTuan/laf_heartbeat/releases)



## 构成

本项目主要构成有3部分。

1. 心跳服务端云函数：`/laf-cloud/functions/__heartbeat_server_test.ts`
2. 心跳客户端云函数：`/laf-cloud/functions/__heartbeat_client_test.ts`
3. 供客户端注册、配置的web服务：除 `/laf-cloud/` 目录外其它文件。访问地址：[heartbeat.muyi.dev](https://heartbeat.muyi.dev/)



## 基本逻辑

1. client 注册到 server，并生成配置项。
2. 配置 client ，激活 client 在 server 的状态。
3. client 向 server 发送心跳，更新 server 中记录的更新时间，并重置异常次数和推送次数。
4. server 定期查询，并处理数据
    1. 更新时间比当前时间超 1 分钟，且异常次数超过最大设定值的，发起推送并计数，直到超过最大推送次数后不再发送。
    2. 更新时间比当前时间超 1 分钟，但异常次数未超过最大设定值的，异常次数+1.



## 使用

### 客户端

### 服务端

### web端



## 技术栈

* Laf 云函数
* nuxt.js v3
* pinia
* elementUI plus
* unocss

---------------------------

下面是立项时构思的大致逻辑, 实际有些许出入.

![20834de9a8c0edd5c766c9887230680](README/20834de9a8c0edd5c766c9887230680.png)

## client

作为客户端的云函数，主要就两个功能

1. 接收server发来的验证请求，返回设定好的key给server进行验证。
2. 发送心跳，去更新server中的数据信息。需要触发器指向这个方法。

## server

作为服务端的云函数，主要有以下功能

1. 注册 client
2. 激活 client
3. 切换 client 暂停状态
4. 删除 client
5. 更新 client 配置
6. 接收心跳，并更新数据。
7. 定时处理异常数据，需要触发器指向这个方法。

## web（未实现）

无服务的web界面，主要有以下功能

1. 用户身份为客户端，选择一个 server，把自己的 client 注册到此 server，并做相关配置。
2. 用户身份为服务端，输入鉴权信息登录后，管理当前 server 下所有 client 数据。

