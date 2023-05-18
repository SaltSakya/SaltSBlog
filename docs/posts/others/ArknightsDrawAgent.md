---
title: 明日方舟代抽的相关研究
icon: note
cover: /assets/images/Touch Fish Time.jpg
isOriginal: true
date: 2022-05-15
category:
  - 其他
tag:
  - 明日方舟
  - 概率
  - 数据
---

2023 年五一愉快的面基时来了一波线下抽卡，愉快之余了解到还有明日方舟主播有**代抽**这样的业务。其业务大致为：付费约 600 元，主播会进行带抽，直到抽出为止，在此过程中超过的部分由主播负担，不足的部分不予退还。

我听到这样的业务第一反应是，“这不是有可能赔本么？”，紧接着就想起了大数理论，即：样本数量越多，其算数平均值就有可能接近期望。这意味着，只要代抽所需开销的期望低于门票钱，那参加的人越多，能赚到钱的概率也就越高。好奇于这个期望大致是多少，故写下这篇文章进行计算。

<!-- more -->

> 「胴元になれば、必ず勝てる、これがギャンブルの必勝法なの」(早乙女めあり『賭ケグルイ双』)  
> “只要坐庄，一定会赢，这就是赌博的必胜法”——早乙女芽亚里《狂赌之渊双》

## 基础知识及前提
### 寻访

**寻访**是《明日方舟》中对所谓“抽卡”玩法的称呼。通过消耗资源进行寻访，玩家可获得 3-6★ 的干员。其中获得 6★ 干员的基础概率为 2%。
可消耗以下几种道具进行寻访（按优先级排序）：
* **特殊十连寻访凭证**：可在限定卡池进行十次寻访，每次限定活动赠送一个；
* **十连寻访凭证**：可进行十次寻访，可通过采购中心购买或
* **寻访凭证**：可进行一次
* **合成玉**：600合成玉/次；
* **源石**：1 源石 = 180 合成玉 = 0.3抽

### 寻访机制

明日方舟的寻访是典型的“伪随机”，即存在“保底”机制，明日方舟通过以下 5 种机制对玩家提供保底：
* **概率提升机制** 

  概率提升机制意味着如果玩家连续 50 次寻访没有获得 6★ 干员，则此后获取 6★ 的概率会逐渐提高，直至获得 6★ 后恢复至 2%。

  这一机制几乎存在于任何一个卡池，是明日方舟的卡池的原型机制[^1]。不同的是，这一机制的累计次数仅在【标准寻访】和【中间寻访】中分别继承，而【限定寻访】则不继承过去的累计次数。

* **新寻访特惠**
  
  新寻访优惠保证玩家在新卡池的前 10 次寻访内，必定获得至少一个 5★ 干员。

* **定向选调** <Badge text="新" type="danger" />

  定向选调为限时寻访的保底机制，于 2023 年 4 月 6 日版本更新后启用。目的为保证玩家能获得新的 6★ 干员。

* **数据契约机制**

  限定池专属的机制。限定池包含两个 6★ 干员，而该机制保证玩家在 300 次寻访后必定可以获得一个想要的 6★ 干员。

* **联动保底**
  
  联动池专属机制。由于联动后续不会复刻，因而是最硬的保底机制，保证 120 次寻访内必出联动 6★ 干员。

对于以上机制的原文表述如下：

::: tabs

@tab 概率提升机制

在所有<span style="color:deepskyblue">【标准寻访】</span>中，如果连续<span style="color:goldenrod">50</span>次没有获得 6★ 干员，则下一次获得 6★ 干员的概率将从原本的<span style="color:goldenrod">2%</span>提升至<span style="color:goldenrod">4%</span>。如果该次还没有寻访到 6★ 干员，则下一次寻访获得 6★ 的概率由<span style="color:goldenrod">4%</span>提升到<span style="color:goldenrod">6%</span>。依此类推，每次提高<span style="color:goldenrod">2%</span>获得 6★ 干员的概率，直至达到<span style="color:goldenrod">100%</span>时必定获得 6★ 干员。

在任何一个<span style="color:deepskyblue">【标准寻访】</span>中，没有获得 6★ 干员时，都会累计次数，该次数不会因为<span style="color:deepskyblue">【标准寻访】</span>的结束而清零。因为累计次数而增加的获得概率，也会应用于接下来任意一次<span style="color:deepskyblue">【标准寻访】</span>。

<span style="color:crimson">【注意】</span>任何时候在任意一个<span style="color:deepskyblue">【标准寻访】</span>中获得 6★ 干员，后续在<span style="color:deepskyblue">【标准寻访】</span>中获得 6★ 干员的概率将恢复到<span style="color:goldenrod">2%</span>。

@tab 新寻访特惠
每开启一个新的寻访池，其中的前<span style="color:goldenrod">10</span>次寻访内，必定获得一名 5★ 以上的干员，每个寻访池限定一次。[^1]

@tab 定向选调
如果连续<span style="color:goldenrod">150</span>次没有获得该限时寻访中出率上升的 6★ 干员，则下一次招募到的 6★ 干员必定为该限时寻访中出率上升的 6★ 干员。该机制在当期寻访中仅生效一次。同时，当期寻访的定向选调累计次数会在该寻访结束时清零，不会累计到后续的其他<span style="color:deepskyblue">【标准寻访】</span>中。[^2]

@tab 数据契约机制
再所有<span style="color:mediumorchid">【限定寻访】</span>中，每进行一次寻访，可获取一张<span style="color:crimson">【寻访数据契约】</span>，寻访十次则可获取十张<span style="color:crimson">【寻访数据契约】</span>，<span style="color:crimson">【寻访数据契约】</span>可用于当期<span style="color:crimson">【寻访数据契约交换所】</span>兑换指定干员。

@tab 联动保底
在<span style="color:crimson">【联动寻访】</span>中前120次寻访必定能够获得限定 6★ 干员，仅限一次。[^3]
:::

### 明日方舟氪金数值

### 代抽的前提
## 明日方舟代抽相关计算
抽出指定干员的期望金额 [^5]

::: echarts Dynamic Data & Time Axis

```js

const probAtIndex = [];// 上次取得 6 星后的第 i+1 次获得 6 星的概率
const probGet6At = [];// 上次取得 6 星后在第 i+1 次获得第 1 个 6 星的概率
const probGet6Before = [];// 上次取得 6 星后在第 i+1 次已获得至少 1 个 6 星的概率

let no6Total = 1;// 连续 i 次未获得的概率
let get6Total = 0;

const listItem = (label, x, y) => {
  return {
    name: label,
    value: [ x, y ],
  };
};

for (let i = 0; i < 99; i++){
  let prob = ( i < 50 ) ? 0.02 : ((i-48)*0.02);
  let count = (i+1).toString();

  get6Total += no6Total * prob;

  probAtIndex.push(listItem(
    "第" + count + "次寻访到 6★",
    count,
    prob
  ));

  probGet6At.push(listItem(
    "第" + count + "次寻访首次获得 6★",
    count,
    probAtIndex[i].value[1] * no6Total
  ));

  probGet6Before.push(listItem(
    "asdf",
    count,
    get6Total
  ))

  no6Total *= (1-probAtIndex[i].value[1]);
}


const option = {
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      return (
        "第" + params[0].value[0] + "次寻访：<br />" + 
        "获得 6★ 的概率为：" + Math.trunc(params[0].value[1]*100) + "%<br />" + 
        "首次获得 6★ 的概率为：" + Math.round(params[1].value[1]*1000000)/10000 + "%<br />" + 
        "已获得 6★ 的概率为：" + Math.round(params[2].value[1]*1000000)/10000 + "%<br />"
      );
    },
    axisPointer: {
      animation: false,
    },
  },
  xAxis: {
    type: "value",
    name: "寻访次数",
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    name: "概率",
    splitLine: {
      show: false,
    },
  },
  legend:{
    show: true,
  },
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true,
      },
      dataView: {
        show: true,
        readOnly: false,
      },
      restore: {
        show: true,
      },
      saveAsImage: {
        show: true,
      },
    },
  },
  series: [
    {
      name: "获得6★",
      type: "line",
      showSymbol: false,
      data: probAtIndex,
    },
    {
      name: "首次获得6★",
      type: "line",
      showSymbol: false,
      data: probGet6At,
    },
    {
      name: "已获得6★",
      type: "line",
      showSymbol: false,
      data: probGet6Before,
    },
  ],
};
```

:::
## 总结 

## 参考

[^1]: 寻访规则 - PRTS - 玩家自由构筑的明日方舟中文Wiki <https://prts.wiki/w/%E5%AF%BB%E8%AE%BF%E8%A7%84%E5%88%99>
[^2]: 部分寻访规则调整说明 - 明日方舟 - TapTap <https://www.taptap.cn/moment/388012575213752034>
[^3]: 砺火成锋 - PRTS - 玩家自由构筑的明日方舟中文Wiki <https://prts.wiki/w/%E7%A0%BA%E7%81%AB%E6%88%90%E9%94%8B>
[^5]: 明日方舟卡池六星保底到底是60发还是100发？-哔哩哔哩 <https://b23.tv/JavpNs0>
