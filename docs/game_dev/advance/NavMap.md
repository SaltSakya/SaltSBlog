---
title: NavMap 地图框架研究
icon: note
#cover: /assets/images/Touch Fish Time.jpg
isOriginal: true
headerDepth: 3
date: 2022-05-15
category:
  - 游戏程序高级知识
tag:
  - 小地图
  - UI
---

一个逻辑层和表现层分离的Gui框架

<!-- more -->

研究豪哥给的小地图框架，分为逻辑层和表现层，过去使用的是 UGUI，现在需要迁移到 FairyGUI，觉得设计思路不错，记录一下。

::: details 我的待办
- [ ] 3D UI Manager
> 需要基于FairyGUI制作一个3DUI的Manager，支持后续的各种地图标点、血条

> 1. 数据：3DUI的字典，key为3DUI的ID，Value为3DUI的Panel、3D位置信息、系统类型等信息。考虑到会有不同的系统接入，需要有一个类似`Dictionary<string, List<string>>`的结构便于各个系统查找数据  
> 2. 方法：创建、销毁、显示、隐藏UI、更新UI

> 此外还需要一个3DUI的基类，需要将他的子类挂载到对应物体上
:::
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

#### NavMapManager <badge text="单例" />
> 继承关系：`NavMapManager`：`MonoBehaviourBase`：`MonoBehaviour`

::: details 变量

* *protected***type:bool** `IsInit` <badge text="外部只读" /> 是否已初始化
* *public***type:bool** `HaveNavMapUI` <badge text="外部只读" /> 是否有导航地图 UI
* *private***type:bool** `m_NavMapUI` NavMapUI 的值
* *public***type:NavMapUI** `NavMapUI` <badge text="外部只读" />
> 返回 `m_NavMapUI`，若为空，则返回 `FindObjectOfType<NavMapUI>()`
* *private***readonly***class:List\<uint\>* `m_RemoveMarkersCached`

:::

::: details 静态信息
* *public***static***enum:MapUIType* `MapUIType` 地图类型
* *public***static***type:bool* `HaveNavMapConfig`  <badge text="外部只读" /> 是否有有效的地图配置数据
* *public***static***struct:NavMapWorldConfig* `NavMapConfigCur` <badge text="外部只读" />
* *public***static***struct:Vector2* `CanvasSize`
* *public***static***type:bool* `CSAngle`
* *public***static***type:bool* `AngleOffset`
* *public***static***struct:Vector2* `CanvasCenterOffset`
* *public***static***struct:Vector2* `CanvasZoom`
* *public***static***struct:Vector2* `CanvasMinBounds`
* *public***static***struct:Vector2* `CanvasMaxBounds`
* *public***static***type:bool* `OffsetToWidgetCenter`
* *public***static***type:bool* `LimitCanvasPositionInBounds`
* *public***static***type:bool* `LimitWidgetInBounds`
* *public***static***type:bool* `LimitWorldLocationInBounds` <badge text="外部只读" />
:::

::: details 生命周期

* *type:void* `Update` 更新 deltatime
> 调用 `OnUpdate(Time.deltaTime)`

:::

::: details 方法

* *public***virtual***type:void* `Init()` 初始化
> * 若 `IsInit` 为 `false`，调用 `InitConfig()`
* *public***virtual***type:void* `CreateMap()`创建地图，请确保在进行 AddMarker 前先调用创建地图
> * 读取当前场景的配置
> * 将当前场景配置保存至 `NavMapConfigCur`
* *public***virtual***type:void* `DestroyMap()` 
> * 令 `m_MarkerIdCounter = 0`
> * 调用 `m_MarkersDic.Clear()`
* *public***virtual***type:void* `OnUpdate(float deltaTime)` 进行更新
> * 对每一个 Marker 调用 `OnUpdate(deltaTime)`
> * 当有需要移除的 Marker 时，逐个移除

:::

::: details Config

*private*<badge text="编辑器公开" vertical="middle" /> sadf

:::

::: details 事件
* *public***static***type:event***class:Action\<NavMarker\>** `OnMarkerAdd`;
* *public***static***type:event***class:Action\<NavMarker\>** `OnMarkerRemove`;
:::

#### NavMapUI
> 继承关系：`NavMapUI`：`NavUIBase`：`MonoBehaviourBase`：`MonoBehaviour`

::: details 预制体结构
```
NavMapUI  
├── MiniMapRoot  
    ├── Map <- `img_Map`  
    ├── MiniMap <- `rts_Minimap`  
        ├── MarksRoot <- `rts_MarksRoot`  
    ├── Fram  
    └── FramVignette
```
:::

##### **变量**

* `Image` `img_Map` 地图图片 <badge text="私有" type="danger" /><badge text="编辑器公开" />
* `RectTransform` `rts_MarksRoot` 标识根节点 <badge text="私有" type="danger" /><badge text="编辑器公开" />
* `RectTransform` `rts_Minimap` 小地图节点 <badge text="私有" type="danger" /><badge text="编辑器公开" />
* `List<NavMarkerConfig>` `m_FsNavMarkerConfigs` 标识配置 <badge text="私有" type="danger" /><badge text="编辑器公开" />
* `MapUIType` `MapUIType` 地图类型 <badge text="公开" type="tip" /><badge text="外部不可写" />
* `Vector2` `CanvasSize` 地图类型 <badge text="公开" type="tip" /><badge text="不可写" /> 返回地图节点的矩形变换大小
* `float` `CSAngle` <badge text="作用不明" type="note" /><badge text="公开" type="tip" /><badge text="外部不可写" />
* `float` `AngleOffset` <badge text="作用不明" type="note" /><badge text="公开" type="tip" /><badge text="外部不可写" />
* `Vector2` `CanvasCenterOffset` 画布（应该是指rts_Minimap）中心偏移 <badge text="公开" type="tip" /><badge text="不可写" />
* `Vector2` `CanvasZoom` 画布（应该是指rts_Minimap）缩放 <badge text="公开" type="tip" /><badge text="不可写" />
* `Vector2` `CanvasMinBounds` 画布（应该是指rts_Minimap）最小边界（可能是BB） <badge text="公开" type="tip" /><badge text="不可写" />
* `Vector2` `CanvasMaxBounds` 画布（应该是指rts_Minimap）最大边界（可能是BB） <badge text="公开" type="tip" /><badge text="不可写" />
* `bool` `OffsetToWidgetCenter` <badge text="作用不明" type="note" /><badge text="公开" type="tip" /><badge text="不可写" />
* `bool` `LimitCanvasPositionInBounds` <badge text="作用不明" type="note" /><badge text="公开" type="tip" /><badge text="不可写" />
* `bool` `LimitWidgetInBounds` <badge text="作用不明" type="note" /><badge text="公开" type="tip" /><badge text="不可写" />
* `Dictionary<uint, NavMarkerUI>` `m_NavMarkerUIDic` 标识：标识UI 键值对 <badge text="私有" type="danger" /><badge text="不可写" />
* `Dictionary<Type, NavMarkerConfig>` `m_FsNavMarkerConfigDic` 标识配置字典 <badge text="私有" type="danger" /><badge text="不可写" />

##### **方法**
* `Awake()` <badge text="私有" type="danger" /><badge text="Unity 生命周期" />

> 有在编辑器内有配置标识时，若标识配置合法，则将其加入标识配置字典
> * 有在编辑器内有配置标识：标识配置 `m_FsNavMarkerConfigs` 不为空 且 标识配置字典 `m_FsNavMarkerConfigDic` 为空
> * 标识配置合法：预制体是 MarkerUI、类型名是 NavMarker 或其子类

* `Start()` <badge text="私有" type="danger" /><badge text="Unity 生命周期" />

> * `NavMapManager` 单例调用 `OnNavMapUICreate(this)`  
> * 若编辑器内未配置标识根节点 `rts_MarksRoot` ，则主动寻找标识根节点
> * 
> * 在 `NavMapManager` 的 `OnMarkerAdd` 和 `OnMarkerRemove` 委托中添加自身的 `OnMarkerAdd` 和 `OnMarkerRemove`

* `OnDestroy()` <badge text="私有" type="danger" /><badge text="Unity 生命周期" />

> * 在 `NavMapManager` 的 `OnMarkerAdd` 和 `OnMarkerRemove` 委托中移除自身的 `OnMarkerAdd` 和 `OnMarkerRemove`
> * `NavMapManager` 单例调用 `OnNavMapUIDestroy(this)`  

* `Update()` <badge text="私有" type="danger" /><badge text="Unity 生命周期" />

> 更新旗下的每一个 `MarkerUI`
> * 调用其 `OnUpdate(Time.deltaTime)`

* `AddMarkerUI(NavMarker marker)` <badge text="公开" type="tip" /><badge text="布尔" />

> 添加一个 MarkerUI
> <badge text="Issue" type="danger" /> 可为某个Id 的 marker 的添加多个 UI
> * 尝试获取 MarkerConfig，若获取失败，说明该地图配置中不显示此 marker，返回 `false`
> * 读取该类型的 Marker 所在的层级，查找该层级
> * 若该层级不存在，在正确的位置创建该层级
> * 在该层级下添加新的 MarkerUI，初始化，调用其 `Init` 和 `OnAdd` 方法
> * 调用 Marker 的 `OnMarkerUIAdd` 方法
> * 将 `{marker.Id : NavMarkerUI}` 键值对添加到 `m_NavMarkerUIDic`

* `RemoveMarkerUI(NavMarker marker)` <badge text="公开" type="tip" /><badge text="布尔" />

> 移除一个 MarkerUI
> * 在 `m_NavMarkerUIDic` 中找出 MarkerUI
> * 调用 Marker 的 `OnMarkerUIRemove` 方法
> * 调用MarkerUI的 `Destroy` 方法
> * 从 `m_NavMarkerUIDic` 中移除对应键值对


* `OnMarkerAdd(NavMarker marker)` <badge text="私有" type="danger" />

> 调用自身 `AddMarkerUI(marker)`

* `OnMarkerRemove(NavMarker marker)` <badge text="私有" type="danger" />

> 调用自身 `RemoveMarkerUI(marker)`

* `GetMarkerUI(NavMarker marker, out NavMarkerUI markerUI)` <badge text="公开" type="tip" /><badge text="布尔" /><badge text="重载" type="warning" />

> 获取 Marker 对应的 MarkerUI
> 若 `marker` 为空，返回 `false`，输出 `null`
> 否则调用 `m_NavMarkerUIDic.TryGetValue(marker.Id, out markerUI)`

* `GetMarkerUI(uint id, out NavMarkerUI markerUI)` <badge text="公开" type="tip" /><badge text="布尔" /><badge text="重载" type="warning" />

> 获取 Marker 对应的 MarkerUI
> 调用 `m_NavMarkerUIDic.TryGetValue(id, out markerUI)`

* `SetMarkerUI(NavMarker marker, Action<NavMarkerUI> handler)` <badge text="公开" type="tip" />

> 设置 MarkerUI
> * 调用 `GetMarkerUI(marker, out NavMarkerUI markerUI)` 查找其 MarkerUI
> * 调用其 `handler(SetActive)`

* `SetMarkerUIShow(NavMarker marker, bool show)` <badge text="公开" type="tip" />

> 设置 MarkerUI 显示/隐藏
> * 调用 `GetMarkerUI(marker, out NavMarkerUI markerUI)` 查找其 MarkerUI
> * 调用其 `GameObject` 的 `SetActive`

* `SetMapImageColor(Color color)` <badge text="公开" type="tip" />

> 设置地图图片的颜色

* `GetNavMarkerConfigs()` <badge text="公开" type="tip" /><badge text="NavMarkerConfig[]" />

> 获取 NavMarker 配置
> 此处返回的是编辑器内的设置 `m_FsNavMarkerConfigs` 而不是 `m_FsNavMarkerConfigDic`

* `GetNavMarkerConfig(NavMarker marker, out NavMarkerConfig config)` <badge text="公开" type="tip" /><badge text="布尔" /><badge text="重载" type="warning" />

> 获取标识配置
> * 若 `marker` 为空，返回 `false`，输出空配置
> * 否则调用最后一条重载

* `GetNavMarkerConfig<T>(out NavMarkerConfig config) where T : NavMarker` <badge text="公开" type="tip" /><badge text="布尔" /><badge text="重载" type="warning" />

> 获取标识配置
> * 调用最后一条重载

* `GetNavMarkerConfig(Type type, out NavMarkerConfig config)` <badge text="公开" type="tip" /><badge text="布尔" /><badge text="重载" type="warning" />

> 获取标识配置
> * 若配置字典 `m_FsNavMarkerConfigDic` 中不包含 `type`，返回 `false`，输出空配置
> * 否则若配置字典 `m_FsNavMarkerConfigDic` 包含 `type`，返回 `true`，输出对应配置

#### NavMarker
> 继承关系：无继承

##### **变量**

* *public***type:uint** `Id` 标识游戏对象，在场景中使用的标识功能脚本，一个标识功能脚本会有一个对应的标识UI <badge text="外部只读" />
* *public***type:bool** `IsActive` 是否激活，非激活时不会Update，但不代表地图上的MarkerUI不显示，想要隐藏需要调用 `SetShow()` <badge text="外部只读" />
* *public***type:bool** `IsShow` 是否显示 <badge text="外部只读" />
* *public***class:Transform** `Target` 跟踪的目标 <badge text="外部只读" />
* *public***struct:Vector3** `TargetPos` 跟踪的点（marker的位置可能并非一个物体的所在位置，如玩家在地图上做标记） <badge text="外部只读" />
* *private***type:float** `m_Duration` 时长

##### **委托**

* *private***class:Action\<NavMarkerUI\>** `m_OnMarkerUIAddCallback_NavMarkerCreaterParams`：可在系统内进行设置<badge text="尚不明确" type="note" />
* *private***class:Action\<NavMarker, NavMarkerUI\>** `m_OnMarkerUIAddHandler` <badge text="尚不明确" type="note" />

##### **方法**

* *public***virtual***type:void* `Init(uint id)` 初始化 ID
* *public***virtual***type:void* `SetInfo(Vector3 pos, Transform target = null, float duration = -1)`

> 设置 `m_Duration` 及 `Target`/`TargetPos`

* *public***virtual***type:void* `OnRemove()`
* *public***virtual***type:void* `OnUpdate(float deltaTime)` 更新

> * 若 `IsActive` 为 `true`，更新
> * 若 `m_Duration` 小于等于 0，移除该 Marker

* *public***virtual***type:void* `OnMarkerUIAdd(NavMarkerUI markerUI)` 当自身对应的 MarkerUI 添加时，一个 Marker 可以对应多个 MarkerUI

> * 调用两个委托

* *public***virtual***type:void* `OnMarkerUIRemove(NavMarkerUI markerUI)` 当自身对应的 MarkerUI 移除时，一个 Marker 可以对应多个 MarkerUI
* *public***type:void**`SetOnMarkerUIAddCallbackForNavMarkerCreatorParams(Action<NavMarkerUI> callback)` 设置委托
* *public***type:void** `SetOnMarkerUIAddHandler(Action<NavMarker, NavMarkerUI> onMarkerUIAddHandler)` 设置当 MarkerUI 添加时对应的操作方法
* *public***virtual***type:void* `SetActiveAndShow(bool active)`
> * 调用 `SetActive(bool active)` 和 `SetShow(bool show)`
* *public***virtual***type:void* `SetActive(bool active)` 设置 `IsActive`
* *public***virtual***type:void* `SetShow(bool show)` 设置 `IsShow`
* *public***type:void** `SetIcon(Sprite sp)` 设置 Icon 图片
* *public***type:void** `SetSize(Vector2 size)` 设置尺寸，一般 Icon 都是跟着根节点尺寸适应
* *public***type:void** `SetIconColor(Color color)` 设置 Icon 的颜色
* *public***type:void** `SetMarkerUI(Action<NavMarkerUI> handlerFunc)` 设置所有此 Marker 对应的 MarkerUI
> 调用 `NavMapManager.Instance.SetMarkerUI(this, handlerFunc)`

#### NavMarkerUI
> 继承关系：`NavMarkerUI`：`NavUIBase`：`MonoBehaviourBase`：`MonoBehaviour`

::: details 预制体结构
* NavMarker
  * Icon <- `gObj_Root`
:::

##### **变量**

* *protected*<badge text="编辑器可见" vertical="middle" />**class:GameObject** `gObj_Root`：Icon 根节点
* *protected***class:Image** `img_Root`：Icon 的图片组件
* *protected***class:CanvasGroup** `cg_Root`：Icon 的 CanvasGroup 组件
* *protected***class:RectTransform** `rts_Root`：Icon 的 RectTransform 组件
* *protected***class:NavMapUI** `m_NavMapUI`：自身所在的 MapUI
* *protected***class:NavMarker** `m_Marker`：自身对应的 Marker
* *protected***struct:Vector3** `m_TargetPos` <badge text="尚不明确" type="note" />
* *protected***type:bool**`UpdateAngle` <badge text="尚不明确" type="note" />
* *protected***type:float** `m_Angle` <badge text="尚不明确" type="note" />

##### **方法**

* *public***virtual***type:void* `Init(NavMarker marker, NavMapUI navMapUI)`：初始化

> * 设置自身的 `m_Marker` 和 `m_NavMapUI`  
> * 载入自身的 `img_Root`、`cg_Root`、`rts_Root`
> * 初始化自身的 RectTransform
> * 调用 `ResetSelf()`

* *protected***virtual***type:void* `ResetSelf()`：重置自身
* *public***virtual***type:void* `OnAdd()`

> * 调用 `ResetSelf(SetTargetPos(m_Marker.TargetPos))`

* *public***virtual***type:void* `OnRemove()`
* *public***virtual***type:void* `Destroy()`
> * 调用 `GameObject.Destroy(gameObject)`
* *public***virtual***type:void* `OnUpdate(float deltaTime)`
> * 若 Marker 世界位置变化过大，更新 UI 位置
> * 若 `UpdateAngle` 为 `true` 且 Marker 旋转和当前旋转不一致，更新 UI 旋转
* *public***type:void** `SetTargetPos(Vector3 targetPos)`：设置目标世界坐标位置
* *public***type:void** `SetRootRotate(float angle)`：设置 Root 的角度
> 角度在 OnUpdate 中更新，但若 `UpdateAngle` 为 `false`，则不会进行旋转
* *public***type:void** `SetIcon(Sprite sp)`：设置 Icon 图片
* *public***type:void** `SetSize(Vector2 size)`：设置尺寸，一般 Icon 都是跟着根节点尺寸适应
* *public***type:void** `SetIconColor(Color color)`：设置Icon的颜色

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
