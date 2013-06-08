# Awesome Stuff

```
------------------------
 OOO   OOO  X   X X   X
O   O O   O  X X   X X
O   O O   O   X     X
O   O O   O  X X   X X
 OOO   OOO  X   X X   X
------------------------
```
![welcome](http://dl.ooxx.org/ooxx/welcome.jpg)

> Hatching... in Baidu hackthon

## Slogan

![logo](http://dl.ooxx.org/ooxx/logo.jpg)

百度出发？百度走起？百度…

oo代表任务，xx代表kill任务

## Topic
我们想整合最新的web技术，为无线找到切入点，为LBS带来崭新的运营模式和无限的想象空间

## keywords

 * 完成任务
 * SNS团队合作，聚合人气
 * 从网络切入现实生活
 * 整合消费类，LBS等资源

## 设计的一些模式

* 私人任务清单~行胜于言

不同与抽象任务类todo，擅长解决出门办事难，管理行程时间地点人物，路线引领

让网络宅男出门，不光在信息获取层面，生活方式中也能简单可依赖，让公司产品切入现实生活

> case1 一周安排，去什么地方办什么事，关键是不再犹豫该怎么去

> case2 中国办手续麻烦…比如买房，出门前列出办事清单…找很多相关部门办各种手续

* 公共竞赛主打的运营模式

激活LBS的真正魅力所在，破冰困局，清晰盈利模式。。。

![game_sketch](http://dl.ooxx.org/ooxx/game_skitch.jpg)

> case1 北京市读书周活动，设置合适目标点，比如国家图书馆，某购书中心等目标点，最先完成团队获得买书折扣

> case2 51黄金周出游景点，最先完成丰厚奖励。。。

* 公开任务

双赢背后是贴心的生活服务

> case1 杭州旅游，要玩些什么，先去哪后去哪，给出最佳游览方案，完成任务奖励知名餐馆巨大折扣，同时可以整合分享空间旅游等产品线


## 技术及分工

node/socket/redis @我

redis @鸟

demo任务设计/herotime 形象元素 与会时大幅宣传海报(用来造势和把Robin吸引过来)/ 产品交互形态优化 @haonan

会上演讲发言，地图调研和跨部门接口人，坐标区域算法，数据持久等  @组长

百度map接口调研，配合联调等 @坤哥

UI框架界面，视觉亮点, logo @我

# Fetch source code

`$ git clone: git@github.com:clyfish/ooxx.git`

this is a private repo belongs to @clyfish so you must submit your ssh pub-key to @leecade first.

# Initialize environment

depends on `nginx 1.x`, `nodejs 0.10.x`, `redis-server 2.6.x` make sure that you have installed.

## 1. Install node_modules

`$ npm install`

## 2. Start redis-server

`$ redis-server redis-server.conf && print "redis is starting..."`

## 3. Start node-server

`$ node server.js`

## 4. preview in brower

`http://127.0.0.1:4444`

# Thanks guys

[fancal](https://github.com/fancal)

[moliniao](https://github.com/moliniao)

[xiaokun](https://github.com/xiaokun)