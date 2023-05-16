---
title: NavMap 地图框架研究
icon: note
#cover: /assets/images/Touch Fish Time.jpg
isOriginal: true
date: 2022-05-15
category:
  - 游戏程序高级知识
tag:
  - 小地图
  - UI
---

研究豪哥给的小地图框架，分为逻辑层和表现层，过去使用的是 UGUI，现在需要迁移到 FairyGUI，觉得设计思路不错，记录一下。

<!-- more -->

## 设计需求 <Badge text="未完成" type="danger" />


## 框架设计
* **概念**
  * **地图**：地图中，地图的部分

    * 地图可以位移、旋转、缩放，隐藏显示；
    * 实际存在的可能不止一张地图；
    * 地图同样负责管理其上的**标识**
    
  * **标识**：地图上的各类型标记，如玩家位置、敌人位置、宝箱位置等

    * 标识可以位移、旋转、缩放，隐藏显示，切换，或播放特定效果等；
    * 标识的行为和表现可能多种多样，因此可以让子类继承标识类，来实现不同的逻辑；

* **实现**

为了解耦逻辑和表现，分为**逻辑层**和**表现层**。

* `NavMapManager` 为逻辑层地图 
* `NavMapUI` 为表现层地图
* `NavMarker` 为逻辑层标识
* `NavMarkerUI` 为表现层标识

### 框架主体 <Badge text="施工中" type="info" />
#### 预制体

#### NavMapManager
> 继承关系：`NavMapManager`：`MonoBehaviourBase`：`MonoBehaviour`

#### NavMapUI
> 继承关系：`NavMapUI`：`NavUIBase`：`MonoBehaviourBase`：`MonoBehaviour`

::: details 预制体结构
* NavMapUI
  * MiniMapRoot
    * Map <- `img_Map`
    * MiniMap <- `rts_Minimap`
      * MarksRoot <- `rts_MarksRoot`
    * Fram
    * FramVignette
:::

* **变量**

* `Image` `img_Map`：地图图片
* `RectTransform` `rts_MarksRoot`：标识根节点
* `RectTransform` `rts_Minimap`：小地图节点
* `List<NavMarkerConfig>` `m_FsNavMarkerConfigs`：小地图节点

#### NavMarker
> 继承关系：无继承

#### NavMarkerUI
> 继承关系：`NavMarkerUI`：`NavUIBase`：`MonoBehaviourBase`：`MonoBehaviour`

::: details 预制体结构
* NavMarker
  * Icon <- `gObj_Root`
:::

* **变量**

* `GameObject` `gObj_Root`：Icon 根节点

### 其他类

#### MonoBehaviourBase
> 继承关系：MonoBehaviourBase: MonoBehaviour

该类逻辑简单，其实就是优化了 Unity 中通过 transform 和 gameobject 获取 Transform 和 GameObject的逻辑，因为默认的方法似乎是每次读取都会重新获取一次 Transform 和 GameObject，因而可能存在逻辑问题。而该类中将这些变量缓存下来，同时提供了直接获取 RectTransform 的接口

代码如下：
::: details MonoBehaviourBase
``` cs
public class MonoBehaviourBase : MonoBehaviour
    {
        public Transform TransformGet // 获取 Transform
        {
            get
            { 
              if (m_Transform == null) m_Transform = transform;
              return m_Transform;
            }
        }
        private Transform m_Transform;// 缓存的 Transform

        public RectTransform RectTransformGet// 获取 RectTransform
        {
            get 
            { 
              if (m_RectTransform == null) m_RectTransform = transform as RectTransform;
              return m_RectTransform;
            }
        }
        private RectTransform m_RectTransform;// 缓存的 RectTransform

        public GameObject GameObjectGet// 获取 GameObject
        {
            get
            { 
              if (m_GameObjectGet == null) m_GameObjectGet = gameObject;
              return m_GameObjectGet;
            }
        }
        private GameObject m_GameObjectGet;// 缓存的 GameObject
    }
```
:::
#### NavUIBase
> 继承关系：NavUIBase: MonoBehaviourBase: MonoBehaviour

空类，应该只是为了给所有表现层 UI 一个基类。

## 参考

[^1]: 寻访规则 - PRTS - 玩家自由构筑的明日方舟中文Wiki <https://prts.wiki/w/%E5%AF%BB%E8%AE%BF%E8%A7%84%E5%88%99>
[^2]: 部分寻访规则调整说明 - 明日方舟 - TapTap <https://www.taptap.cn/moment/388012575213752034>
[^3]: 砺火成锋 - PRTS - 玩家自由构筑的明日方舟中文Wiki <https://prts.wiki/w/%E7%A0%BA%E7%81%AB%E6%88%90%E9%94%8B>
[^5]: 明日方舟卡池六星保底到底是60发还是100发？-哔哩哔哩 <https://b23.tv/JavpNs0>
