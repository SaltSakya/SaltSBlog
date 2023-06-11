---
title: 通过动画系统的传播速度(暂定)
icon: software
#cover: /assets/images/Touch Fish Time.jpg
#isOriginal: true
date: 2022-06-10
category:
  - 其他
tag:
  - 未定
---

本文基于 [Propagating Velocities through Animation Systems](https://theorangeduck.com/page/propagating-velocities-through-animation-systems)

<!-- more -->
```card
title: Mr.Hope
desc: Where there is light, there is hope
logo: https://mrhope.site/logo.svg
link: https://mrhope.site
color: rgba(253, 230, 138, 0.15)
```
## 前言

动画系统中有两个常常让人感到头疼的东西：**重置**和**传送**。

问题在于，当我们想要把角色重置到一个新的状态或姿势，或者把角色传送到一个不同的位置时，通常需要通知大量的系统，或者找到对应的方法来处理这种变化——从物理、布料、动画和玩法到渲染。

许多游戏引擎有着各种各样的解决方案：其中一些子系统尝试自动检测何时发生传送或者重置，其他一些使用 Clamp，或者其他试探手段；来限制可能发生的最坏的伪影。我使用过的游戏引擎中，很少有专门的代码路径来优雅地处理传送和重置，而他们则是 Bug 和故障（glitches）的常见元凶。
::: tip Bug? Glitch?
在中文语境下通常很难区分英文语境下的 Bug 和 Glitch，中文语境下我们通常将其统称为 Bug 或者邪道。[^1]
* Glitch：本文将翻译为“故障”。其指代不借助外部工具，可在游戏中直接实现，但显然不符合期望的玩法，如穿墙、空中游泳（只狼）、无限火箭筒消耗手枪子弹（生化危机4RE）等。
* Bug：指代会导致游戏无法继续进行，甚至崩溃的严重问题，如黑屏、闪退等严重问题

由于原文是英文，因此读者有必要理解这两个单词在英文中的含义。
:::

问题的一个核心在于，游戏中的许多系统需要每帧记录与角色相关的一些状态（比如关节的位置和速度）。在角色传送或重置时，让这些数据突然发生变化，而不通知的话，处理起来是很困难的。

例如，如果角色突然切换姿势，布料系统要如何做出良好的反应？真正需要的是提供一个匹配角色新姿势的新初始状态。然而很少有设计师愿意处理如此复杂的问题，他们只想让他们的角色移动到一个新的位置，或者开始播放新的动画。

动画系统自身更是深受其害——因为我们在动画中做的很多事情都需要某种状态和（或）速度。大多数情况下，这些速度是通过跟踪前一帧的姿态并使用有限差分计算得来的。这被用于运动扭曲、IK、惯性化、基于物理的动画，甚至是动态模糊和时域抗锯齿（Temporal Anti-Aliasing, TAA）。

而存储这些先前的姿态并进行有限差分有几个大问题：

1. 在角色传送，或者被重置为一个新姿态时，任何在这一帧通过有限差分计算的速度都是无效的。除非我们知道何时要放弃这些错误的有限差分，不然我们一定会见到视觉故障。

2. 就算我们可以得知或检测何时发生了重置或传送，我们也需要再等一帧，才能进行有限差分计算，因此当前帧没有有效的速度，我们仍然需要做一些事情。假设 0 速度通常是不够的，而且会在角色重置为快速移动的动画时导致故障。

3. 如果我们找到一种方法来处理整个角色的重置和传送，我们仍然要注意应该如何、何时来计算有限差分，因为来自某些动画系统的动画有时会非常不稳定。例如：非常快速地混合两个不同的动画，或者应用 IK 来把脚弹出地形。如此大的速度会非常不稳定，尤其是如果他们最终会以某种形式反馈到物理或动画系统中。并且这些甚至都没有开始解决诸如 LOD 切换或视野外优化问题。

有一种我并不经常见到的替代方法，但它可以解决其中的许多问题。思路是（尽可能地）通过动画系统本身传播速度。目标是建立一个可以实时直接估计角色在任何一个点的速度的系统，甚至是在角色被传送或者重置的那一帧上，并且我们没有历史姿势。不仅如此，我们还可以控制这些速度的计算方式，这意味着我们可以在我们知道会破坏他们的地方进行补偿，比如快速混合和即时姿态校正。

尽管这么做会有性能开销，但通过加入一些巧妙地数学，和一些需要回到有限差分的边缘情况，长远来看，我相信这可以创造一个更加鲁棒的系统。

那么，让我们从头——采样动画数据，开始说起吧：

::: details 原文
Here is something that is almost always a headache for animation systems: resets and teleports.

The issue is that when we want to reset a character to a new state or pose or teleport the character to a different location there are usually a whole host of other systems that need to either be informed, or find a way to deal with this change - from physics, cloth, animation and gameplay to rendering.

Many game engines have a hodge-podge of solutions: some of these sub-systems try to auto-detect when teleports or resets have occurred, others use clamping, or other heuristics to limit the worst-case artefacts that can occur. Few game engines I've worked with have a dedicated code path for elegantly handling teleports and resets and they are a very common cause of bugs and glitches.

A core part of the problem is that many systems in the game need to record some state related to the character each frame (such as the positions and velocities of joints). Having this data just suddenly change without notice when the character teleports or resets is difficult to deal with.

For example, if the character suddenly switches pose how is a cloth system possibly meant to react well? What it really needs is to be provided a new initial starting state that matches the character's new pose. But few designers want to deal with this level of complexity - they just want their character to move to a new location, or to start playing a new animation.

Animation systems themselves are big sufferers of this - because there are many things we do in animation that require state and/or velocities of some kind. Most often these velocities are computed by keeping track of the pose from the previous frame and using finite difference. This is used for things like motion warping, inverse kinematics, inertialization, physics based animation, and even motion blur and temporal anti-aliasing.

And there are several big issues that storing this previous pose and doing finite-differencing everywhere introduces:

Any velocity computed via finite difference will not be valid during a frame where the character has teleported or been reset to a new pose. Unless we know when to discard these bad finite differences, we are sure to see visual glitches.
Even if we are told or can detect when the reset or teleport happened, we need to wait one more frame before we can do the finite difference computation - leaving us one frame without a valid velocity where we still need to do something. Assuming zero velocity is often not enough and can produce glitches when characters are reset into fast moving animations.
If we find a way to handle whole-character resets or teleports, we still need to be careful how and when we compute the finite difference, as animations coming from certain animation systems can sometimes be very jerky. For example: blending very quickly between two different animations, or appling IK and popping the foot up and out of the terrain. Such large velocities can be unstable - in particular if they end up feeding back into the physics or animation system in any way. And all of this doesn't even begin to tackle problems like LOD switches or out-of-view optimizations.
There is an alternative approach, which I have not seen used very often, but which can potentially solve many of these issues. The idea is to (as much as possible) propagate velocities though the animation system itself. The goal is to build a system which can directly evaluate the velocity of the character at any point in time, even on frames where the character has been teleported or reset and we have no history of poses. Not just that, but also to have control over how these velocities are computed - meaning we can compensate for the places we know we will break them such as quick blends and instant pose corrections.

And although there can be a performance cost in doing this, a little bit of tricky maths involved, and some edge cases where you need to fall back to finite differencing, I believe it should be able to create systems that are a lot more robust in the long term.

So let's start at the beginning, sampling animation data:
:::

---

## 动画采样

如果我们正在连续时间内采样我们的动画数据，我们很可能已经准备通过查找至少两个连续帧来进行混合，因此我们可以直接通过在这两帧做有限差分，来几乎 0 成本地计算本地关节速度（假设我们的动画数据是干净的，不包含传送、重置、突然的跳动或者其他弹出）。

给出一个基础的姿态表达，

``` c++
struct pose{
    array1d<vec3> positions;
    array1d<quat> rotations;
    array1d<vec3> scales;
    array1d<vec3> linearVelocity;
    array1d<vec3> angularVelocity;
    array1d<vec3> scaleVelocity;
};
```
<ArtPlayer src="/assets/videos/sampling.m4v" />


## 正向与反向动力学
## 运动学
## 双向混合
## 附加动画
## 惯性化
## 死亡混合
## 程序动画
## 有限差分
## 总结
## 源代码



[^1]: 速通导论 EP.6 什么是 Glitch / 邪道 前篇 <https://www.bilibili.com/video/BV1F94y127v6/>