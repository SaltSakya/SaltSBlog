---
title: Unity 中的着色器
order: 2
icon: module
#cover: /assets/images/Touch Fish Time.jpg
date: 2022-06-11
category:
  - Unity Shader 圣经
tag:
  - shader
  - Unity
  - CG
---

<!-- more -->

## 2.1 着色器是什么？

鉴于我们有了基础知识，我们将会开始了解 Unity 中的着色器。
着色器是一个扩展名为“**.shader**”（如 `color.shader`）小程序，它可以在我们的项目中生成有趣的效果。
其中包含有数学运算，和指令（命令）列表，可以对在电脑屏幕上覆盖一个物体的区域内的每个像素进行颜色处理。

这个程序让我们可以基于多边形物体的属性绘制元素（使用坐标系）。
着色器由 GPU 执行，因为它有着由数千个小巧、高效的核组成的并行的架构，专门设计出来同时解决任务，而 CPU 却是设计出来进行顺序串行处理的。

注意，Unity 有 3 种文件跟着色器相关。
首先，我们有扩展名为“**.shader**”的程序，它可以在不同种类的渲染管线中编译。

其次，我们有扩展名为“**.shadergraph**”的程序，它只能在 URP 或 HDRP 中编译。
此外，我们还有扩展名为“**.hlsl**”的文件，可以创建自定义函数。
通常用于 Shader Graph 中的 `Custom Function` 节点。

此外还有一种扩展名为“**.cginc**”的程序，我们日后再谈。
现在让我们要建立如下的联系：“**.cginc**”关联到“**.shader**” CGPROGRAM，而“**.hlsl**”关联到“**.shadergraph**” HLSLPROGRAM。
这种类比是基础，因为每一种扩展名都满足不同的功能，并会用于特定的场合。

![图 2.1a](/unityshaderbible/33-0.png)

在 Unity 中，至少定义了 4 种类型的结构来生成着色器，其中有**顶点着色器**和**片元着色器**的组合，然后是用于自动光照计算的**表面着色器**，和用于更高级概念的**计算着色器**。
每一种结构都有预先描述的属性和方法，方便编译过程。
我们也可以简单地定义我们的运算，因为软件会自动添加这些结构。

## 2.2 编程语言介绍

在开始介绍代码之前，我们需要知道，在 Unity 中，有 3 种编程语言和着色器开发相关，他们是 HLSL（High-Level Shader Language - Microsoft）、Cg（C for Graphics - NVIDIA，仍在着色器中编译，但在最近版本的软件中已不再使用）和 ShaderLab(声明性语言 - Unity)。

我们将首先在内置 RP 中使用 Cg 和 ShaderLab 语言开始我们的学习，随后在 URP 中引入 HLSL。

Cg 是一种高级编程语言，它可以在大多数 GPU 上编译。
它由英伟达和微软合作开发，并且使用和 HLSL 非常相似的语法。
使用 Cg 语言来编写着色器的原因在于，它既可以编译 HLSL，也可以编译 GLSL（OpenGL Shading Language），加速并优化了为电子游戏创建材质的过程。

我们创建着色器的时候，我们的代码啊在一个叫做 CGPROGRAM 的域中编译。
Unity 最近致力于为 Cg 和 HLSL 提供更多的支持和兼容，因此这些块很有可能很快就会被 HSLSPROGRAM 和 ENDHLSL 取代，因为 HLSL 是最新版本的 Unity（2019 版本及以后） 中的官方着色器编程语言。

Unity 中所有的着色器（除了 Shader Graph 和 计算着色器）都是使用一种叫做 ShaderLab 的声明性语言编写的。
这种语言的语法可以在 Unity 的 Inspector 窗口显示着色器的属性。
这很有趣，因为我们可以实时操作这些变量和向量的值，调整我们的着色器以达到预期的效果。

在 ShaderLab 中，我们可以手动定义几个属性和命令，其中包括 **回退**（**Fallback**）块，它与现有的不同类型的渲染管线兼容。

*回退*是多平台游戏的基础块。
他让我们可以把一个不同的着色器编译到一个出错的编译器上。
如果着色器在编译过程中跳出，*回退*返回另一个着色器，如此一来图形硬件就可以继续工作。

**子着色器**是 ShaderLab 中的另一个块，我们可以在其中声明命令，并生成*通道*。
我们编写 Cg 或 HLSL 时，着色器会包含不止一个*子着色器*或*通道*，但是，在可编程 RP 中，一个着色器的*每个子着色器*只能包含一个*通道*。


## 2.3 着色器类型

要开始创建着色器，我们必须先在 Unity 中创建一个工程。如果你在使用 Unity Hub，推荐使用最新版本的软件来创建工程（如 2019、2020 或 2021）。

我们需要使用*内置 RP* 的 **3D 模板**，来方便我们理解图形编程语言。
在我们创建好工程之后，我们要在 **Project 窗口**点击右键（Ctrl + 5 或 cmd + 5），选择 Create 并选择 Shader 选项。

![图 2.3a 通过 Assets / Create / Shader 也能达到一样的效果](/unityshaderbible/35-0.png)

如你所见，有不止一种着色器，其中包含：
* 标准表面着色器（Standard Surface Shader）
* 无光照着色器（Unlit Shader）
* 图像效果着色器（Image Effect Shader）
* 计算着色器（Compute Shader）
* 光线追踪着色器（Ray Tracing Shader）

::: warning
在后续的译文中，以上着色器的的名字可能会混合使用中英文。
:::

着色器的列表取决于创建工程的 Unity 版本。
另一个会影响列表中出现的着色器数量的因素是 **Shader Graph**。如果使用 URP 或 HDRP 来创建工程，他可能会包含 Shader Graph 包，会使得可创建的着色器数量增加。

我们暂时不会将这个话题进行下去，因为我们需要在开始之前先理解一些概念，所以我们会先限制在内置 RP 中默认包含的这些着色器中。

开始创建我们的第一个着色器之前，我们先简要介绍一下软件中包含的不同类型的着色器。

### 2.3.1 标准表面着色器

这种着色器的特点是它和基础光照模型交互的代码编写优化，并且只能在**内置 RP** 中使用。如果我们想创建一个能跟光源交互的着色器，有两个选项：
1. 使用 Unlit 着色器并添加数学函数，以使得光照可以渲染到材质上。
2. 或者使用有基础光照模型的标准表面着色器，该光照模型一般包含反射率、镜面反射和漫反射。
::: tip
此处原文表述如下
> Or use a Standard Surface Shader which has a basic lighting model that in some cases includes __albedo__, specular, and __diffuse__.

Unity 的文档中将 `Albedo` 称为“漫射颜色”，英文文档直接就是 "Diffuse Color"[^1]。但这两个词其实有一些区别[^2]。
* `Albedo` 意为“反射率”，是物理学术语，描述物体反射光的比例。取值范围是 $0\to1$，对应“不反射光”和“反射全部光”。我们可以将 Albedo 贴图理解为物体在明亮且均匀的白色光照条件下表现出的颜色（这样的光照条件大概是指“光来自四面八方，颜色为`#FFFFFF`的光照，且即便存在遮挡，也不存在阴影”）。
* `Diffuse` 则意为“漫反射”，可以理解为“我们眼睛看到的颜色”。Diffuse 贴图的颜色通常是由 Albedo 贴图通过某些算法计算得出的，它可能包含光影信息。另外，在非 PBR 的工作流中，也会使用 Diffuse 这个说法。

![Albedo vs Diffuse](https://cloud.a23d.co/files/2023/02/A23D-Diffuse-Map-vs-Albedo-Map.webp)

此外还有一个词：`Base Color`，这个词主要用于 Metal/Roughness 的工作流中。虚幻引擎也是用这个表述。

后续 `albedo` 和 `diffuse` 将被统一翻译成“漫反射”；当有所区别时，会使用“反射率”或直接使用英文原文。
:::

### 2.3.2 Unlit 着色器

“Lit” 一词代表材质受到光照影响，而“Unlit”则正相反。
**无光照着色器**表示原始颜色模型，它是我们常常用来创建自定义效果的基础结构。
这种程序十分适合低端硬件，其代码中没有优化，因此我们可以看到它完整的结构，并根据我们的需要进行修改。
它的主要特点是，它既可以用于内置 RP，也可以用于可编程 RP。

### 2.3.3 图像效果着色器

这种着色器在结构上与无光照着色器相似。
图像效果着色器主要用于内置 RP 的后期处理效果，并且需要函数 `OnRenderImage`(C#)。

### 2.3.4 计算着色器

这种程序的特点在于它运行在正常渲染管线之外的显卡上，并且在结构上和前面提到的几个着色器大有不同。

不像一般的着色器，它的扩展名是“**.compute**”，并且它的编程语言是 HLSL。
*计算着色器*在特定的情况下，用于加速某些游戏处理。

本书的第三章会详细讲解这种着色器。

### 2.3.5 光线追踪着色器

光线追踪着色器是扩展名为“.raytrace”的实验性程序。
它可以在 GPU 上进行光线追踪处理。
它仅可用于 HDRP 并且有一些技术限制。
如果我们想要使用 DXR （DirectX Ray Tracing），我们必须至少有一块支持 RTX 的 GTX 1080 或等效的显卡、Windows 10 1809+ 版本和 Unity 2019.3b1 以上。

我们可以使用这种程序来取代“.compute”类型的着色器，来处理光线投射的算法，例如：全局照明、反射、折射和焦散。

## 参考
[^1]: [Unity - Manual: Writing Surface Shaders](https://docs.unity.cn/2022.1/Documentation/Manual/SL-SurfaceShaders.html)
[^2]: [Difference between Albedo and Diffuse map](https://www.a23d.co/blog/difference-between-albedo-and-diffuse-map/)