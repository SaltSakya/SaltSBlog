---
title: 属性、命令和函数
order: 3
icon: code
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

我们编写着色器代码时，大多数都将从**着色器**的生命开始，随后是它在 **Inspector** 中的路径，最后是我们指定给它的**名称**（形如着色器“shader inspector path / shader name”）。

子着色器和回退之类的属性都是写在 ShaderLab 声明性语言的 “Shader” 域中的。

``` hlsl
Shader "InspectorPath/shaderName"
{
  // write ShaderLab code here 此处编写 ShaderLab 代码
}
```

因为 USB_simple_color 已经默认声明了 “Unlit/USB_simple_color”，如果我们要将其指定给一个材质，我们就需要在 Unity 的 Inspector 中，找到 Unlit 路径，并选择“USB_simple_color”。

路径和名称都可以根据项目的规范要求来更改。

``` hlsl
// default value 默认值
Shader "Unlit / USB_simple_color"
{
  // write ShaderLab code here 此处编写 ShaderLab 代码
}

// customize path to USB (Unity Shader Bible) Unity 着色器圣经的自定义路径
Shader "USB / USB_simple_color"
{
  // write ShaderLab code here 此处编写 ShaderLab 代码
}
```

### 3.2.1 ShaderLab 属性

属性对应可在 Unity 的 Inspector 中调整的一系列参数。
共有 8 种数值和用处各不相同的属性。
无论是在动态地还是运行时，我们都可以使用这些与我们要创建或修改的着色器相关属性。
声明一个属性的语法如下：

``` hsls
PropertyName ("display name", type) = defaultValue
```

"**PropertyName**"表示属性名（如：_MainTex），
"**display name**"对应在 Unity 的 Inspector 中显示的属性名（如：Texture），
"**type**"指定了属性的类型（如：Color、Vector、2D 等），
最后，顾名思义，"**defaultValue**"是指定给属性的默认值（例如，如果我们的属性是一个 “Color” 类型，我们可以设置它的默认值为 (1, 1, 1, 1)）。

![图 3.2.1a](/unityshaderbible/44-0.png)

细看我们的 USB_simple_color 的*属性*，我们会注意到在属性域中已经声明了一个纹理属性，我们可以从下面这行代码中证实这一点。
``` hsls
Properties
{
  _MainTex ("Texture", 2D) = "white" {}
}
```

需要考虑的一点是，当我们声明属性时，它要在属性域中保持“开放”的状态，因此我们要避免在代码行末尾添加分号（；），否则 GPU 会无法读取程序。

#### 3.2.1.1 数字与滑块属性

这些类型的属性让我们可以在 Shader 中添加数值。
假设我们要创建一个有照明功能的着色器，其中 0 表示 0% 照明，而 1 表示 100% 照明。我们可以为其创建一个范围（例如 Range(min, max)），并配置最小、最大和默认照明值。

下面的语法在着色器中声明了数字和滑块。

``` hlsl
// name ("display name", Range(min, max)) = defaultValue
// name ("display name", Float) = defaultValue
// name ("display name", Int) = defaultValue

Shader "InspectorPath/shaderName"
{
  Properties
  {
    _Specular ("Specular", Range(0.0, 1.1)) = 0.3
    _Factor ("Color Factor", Float) = 0.3
    _Cid ("Color id", Int) = 2
  }
}
```

上方的示例中，我们声明了三个属性，一个是名为 **_Specular** 的“浮点区间”类型，另一个是名为 **_Factor** 的“浮点缩放”类型，最后是一个叫 **_Cid** 的“整数”类型。

#### 3.2.1.2 颜色与向量属性

在这个属性中，我们可以在着色器中定义颜色或向量。

假设我们要创建一个可以在执行期间改变颜色的着色器，为此我们需要添加一个颜色属性，让我们可以修改着色器的 RGBA 值。

使用下面的语法在着色器中声明颜色和向量：

``` hlsl
// name ("display name", Color) = (R, G, B, A)
// name ("display name", Vector) = (0, 0, 0, 1)

Shader "InspectorPath/shaderName"
{
  Properties
  {
    _Color ("Tint", Color) = (1, 1, 1, 1)
    _VPos ("Vertex Position", Vector) = (0, 0, 0, 1)
  }
}
```

上方的示例中，我们声明了两个属性，一个名为 **_Color** 的“颜色”类型， 和一个名为 **_VPos** 的“向量”类型。

#### 3.2.1.3 纹理属性

这些属性让我们可以在着色器中实现纹理。

如果我们想在我们的物体（例如一个 3D 角色）上放一张纹理，我们需要为其添加一个 2D 属性作为纹理，随后通过一个名为“tex2D”的函数传入，这个函数需要两个参数：模型的纹理和UV坐标。

在电子游戏中常用的一个属性是“Cube”，它代表一个“立方贴图”，这种纹理在生成反射贴图时非常有用，例如，角色盔甲和金属元素的反射。

另一种我们能见到的贴图是 3D 类型的。这类贴图不像前一个那么常用，因为它是有体积的，并且有为空间计算的额外坐标。

如下语法可以在着色器种声明贴图：

``` hlsl
// name ("display name", 2D) = "defaultColorTexture"
// name ("display name", Cube) = "defaultColorTexture"
// name ("display name", 3D) = "defaultColorTexture"

Shader "InspectorPath/shaderName"
{
  Properties
  {
    _MainTex ("Texture", 2D) = "white" {}
    _Reflection ("Reflection", Cube) = "black" {}
    _3DTexture ("3D Texture", 3D) = "white" {}
  }
}
```

有件很重要的事要考虑，那就是我们在声明属性的时候是写在 ShaderLab 声明性语言中，而程序则是写在 Cg 或 HLSL 语言中。
因为他们是两种不同的语言，所以我们需要创建“**连接变量**”

这些变量使用“uniform”全局声明，不过这一步可以跳过，因为程序会把它们识别为全局变量。
因此，要为“.shader”添加一个属性，我们必须先在 ShaderLab 中声明，然后在 Cg 或 HLSL 中声明同名变量，最后我们就可以使用了。

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties
  {
    // declare the properties 声明属性
    _MainTex ("Texture", 2D) = "white" {}
    _Color ("Color", Color) = (1, 1, 1, 1)
  }
  SubShader
  {
    Pass
    {
      CGPROGRAM
      ...
      // add connection variables 添加连接变量
      sampler2D _MainTex;
      float4 _Color;
      ...
      half4 frag (v2f i) : SV_Target
      {
        // use the variables 使用变量
        half4 col = tex2D(_MainTex, i.uv);
        return col * _Color;
      }
      ENDCG
    }
  }
}
```

在这个例子中，我们声明了两个属性：**_MainTex** 和 **_Color**。
之后我们在 CGPROGRAM 中创建了两个连接变量，他们对应了 `sampler2D _MainTex` 和 `float4 _Color`。
两个属性和两个连接变量必须有相同的名字，以便程序可以识别。

我们会在 [3.27 节]()讲解关于数据类型的地方细说 2D 采样器的运算。

## 3. 材质属性绘制器

另一种我们可以在 ShaderLab 中找到的属性是“绘制器”。
这个类让我们可以在 Unity 的 Inspector 中生成自定义属性，从而促进着色器的条件编程。

默认情况下，这类属性没有包含在我们的着色器中，因此我们需要根据我们的需要进行声明。
目前为止，有七种不同的绘制器：

* **开关**
* **枚举**
* **关键字枚举**
* **强化滑块**
* **整型范围**
* **空格**
* **标题**

它们每一个都有特定的函数，且独立声明。



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