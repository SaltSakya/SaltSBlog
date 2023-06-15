---
title: 属性、命令和函数
order: 3
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
## 3.1 顶点/片元着色器的结构

为了分析它的结构，我们要创建一个 **Unlit 着色器**并命名为“**USB_simple_color**”。
我们已经了解到，这种着色器是基础颜色模型，并且代码中没有过多的优化，这让我们可以深入分析其各种属性及方法。

当我们第一次创建材质时，Unity 会添加默认代码方便其编译过程。
在程序中，我们可以看见以这种 GPU 可以解释的方式组织的代码块。
如果我们打开 **USB_simple_color** 着色器，它的结构应该像这样：

::: details USB_simple_color 代码
``` hlsl
Shader "Unlit/USB_simple_color"
{
  Properties
  {
    _MainTex ("Texture", 2D) = "white"{}
  }
  SubShader
  {
    Tags {"RenderType"="Opaque"}
    LOD 100

    Pass
    {
      CGPROGRAM
      #pragma vertex vert
      #pragma fragment frag
      // make fog work
      #pragma multi_compile_fog

      #include "UnityCG.cginc"
      struct appdata
      {
        float4 vertex : POSITION;
        float2 uv : TEXCOORD0;
      };

      struct v2f
      {
        float2 uv : TEXCOORD0;
        UNITY_FOG_COORDS(1)
        float4 vertex : SV_POSITION;
      };

      sampler 2D _MainTex;
      float4 _MainTex;

      v2f vert (appdata v)
      {
        v2f o;
        o.vertex = UnityObjectToClipPos(v.vertex);
        o.uv = TRANSFORM_TEX(v.uv, _MainTex);
        UNITY_TRANSFER_FOG(o, o.vertex);
        return o;
      }

      fixed frag (v2f i) : SV_Target
      {
        // sample the texture
        fixed4 col = tex2D(_MainTex, i.uv);
        // apply fog
        UNITY_APPLY_FOG(i.fogCoord, col);
        return col;
      }
      ENDCG
    }
  }
}
```
:::

我们大概不完全理解我们刚创建的着色器中，不同的代码块中到底发生了什么。
但是，要开始我们的学习，我们需要关注它的常规结构。
``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties
  {
    // properties in this field
  }

  SubShader
  {
    // SubShader configuration in this field
    Pass
    {
      CGPROGRAM
      // programa Cg - HLSL in this field
      ENDCG
    }
  }
  Fallback "ExampleOtherShader"
}
```
::: center
(Cg 和 HLSL 的着色器结构都是相同的，唯一的不同在于 Cg 和 HLSL <br/>
的程序块。为了兼容性，两者都能在最新版的 Unity 中编译。)
:::

前面的示例展示了着色器的主要结构。着色器以它在 **Inspector** 中的路径（InspectorPath）和**名称**（shaderName）开始，之后是**属性**（如材质、向量、颜色等），再之后是**子材质**，最后是可选的**回退**。

“InspectorPath”代表我们要选择要应用到材质的着色器的位置。
这个选择是在 Unity 的 Inspector 中进行的。

我们要记住，我们不能直接将着色器应用到一个多边形物体上，我们需要先创建一个材质，才能将其应用到多边形物体上。
我们的 USB_simple_color 着色器默认路径是“Unlit”，这意味着：对于 Unity，我们需要先选择我们的材质，在 Inspector 面板中，找到路径 Unlit 并应用 USB_simple_color。

我们必须要知道的一个结构因素是，GPU 会从上到下线性地阅读代码，因此如果我们快速创建了一个函数，并把它写在了使用它的代码块下方，GPU 就无法阅读到它，于是就会在着色器处理中产生一个错误，于是回退就会指定另一个着色器，以便显卡可以继续其处理。

让我们做个小练习来理解这个概念。
``` hlsl
// 1. declare out function 定义我们的函数
float4 ourFunction()
{
  // your code here ... 代码写在这里...
}
// 2. we use the function 使用函数
fixed4 frag (v2f i) : SV_Target
{
  // we are using the function here 在这里使用我们的函数
  float4 f = ourFunction();
  return f;
}
```

上述函数的与语法可能无法完全理解。
创建这些只是为了概念化一个函数与另一个函数的位置关系。

在 [4.0.4 节](implementation_and_other_concepts.md#_4-4-hlsl-中的函数结构)我们会详细介绍函数的结构。
现在，我们只要知道上述例子的结构是正确的，因为函数 `ourFunction` 已经在代码块被放置的位置写过了。
GPU 会先读到 `ourFunction` 然后才继续执行片元阶段 `frag`。

让我们看看另一种情况。
``` hlsl
// 2. we use the function 使用函数
fixed4 frag (v2f i) : SV_Target
{
  // we are using the function here 在这里使用我们的函数
  float4 f = ourFunction();
  return f;
}
// 1. declare out function 定义我们的函数
float4 ourFunction()
{
  // your code here ... 代码写在这里...
}
```

相对的，这个结构会产生一个“错误”，因为函数 `ourFunction` 被写在了使用它的地方下面。

## 3.2 ShaderLab 着色器
### 3.2.1 ShaderLab 属性
#### 3.2.1.1 数字与滑块属性
#### 3.2.1.2 颜色与向量属性
#### 3.2.1.3 纹理属性

## 3. Material Property drawer
## 3. MPD Toggle
## 3. MPD KeywordEnum
## 3. MPD Enum
## 3. MPD PowerSlider and IntRange
## 3. MPD Space and Header
## 3. ShaderLab SubShader
## 3. 子着色器标签
## 3. Queue标签
## 3. 渲染类型标签
## 3. 子着色器混合
## 3. 子着色器 AlphaToMask
## 3. 子着色器颜色Mask
## 3. 子着色器 Culling 和深度测试
## 3. ShaderLab Cull
## 3. ShaderLab ZWrite
## 3. ShaderLab ZTest
## 3. ShaderLab Stencil
## 3. ShaderLab 通道
## 3. CGPROGRAM / ENDCG
## 3. 数据类型
## 3. Cg / HLSL Pragmas
## 3. Cg / HLSL Include
## 3. Cg / HLSL 顶点输入与顶点输出
## 3. Cg / HLSL 变量和关联向量
## 3. Cg / HLSL 顶点着色器阶段
## 3. Cg / HLSL 片元着色器阶段
## 3. ShaderLab 回退