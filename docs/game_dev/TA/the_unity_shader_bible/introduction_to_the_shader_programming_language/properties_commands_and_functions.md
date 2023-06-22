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

## 3.3 ShaderLab 属性

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

![图 3.3a](/unityshaderbible/44-0.png)

细看我们的 USB_simple_color 的*属性*，我们会注意到在属性域中已经声明了一个纹理属性，我们可以从下面这行代码中证实这一点。
``` hsls
Properties
{
  _MainTex ("Texture", 2D) = "white" {}
}
```

需要考虑的一点是，当我们声明属性时，它要在属性域中保持“开放”的状态，因此我们要避免在代码行末尾添加分号（；），否则 GPU 会无法读取程序。

### 3.3.1 数字与滑块属性

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

### 3.3.2 颜色与向量属性

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

### 3.3.3 纹理属性

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

我们会在[3.27 节](#) ==讲解关==于数据类型的地方细说 2D 采样器的运算。

## 3.4 材质属性绘制器

另一种我们可以在 ShaderLab 中找到的属性是“绘制器”（Drawer）。
这个类让我们可以在 Unity 的 Inspector 中生成自定义属性，从而促进着色器的条件编程。

默认情况下，这类属性没有包含在我们的着色器中，因此我们需要根据我们的需要进行声明。
目前为止，有七种不同的绘制器：

* **Toggle**（开关）
* **Enum**（枚举）
* **KeywordEnum**（关键字枚举）
* **PowerShlider**（指数滑块）
* **IntRange**（整型范围）
* **Space**（空格）
* **Header**（标题）

它们每一个都有特定的函数，且独立声明。

有了这些属性，我们可以在程序中生成多种状态，让我们无需运行时改变材质，即可创建动态效果。
我们通常和两种**着色器变体**一起使用这些绘制器，它们是 **#pragma multi_compile** 和 **#shader_feature**。

![图 3.4a](/unityshaderbible/49-0.png)

### 3.4.1 MPD 开关

在 ShaderLab 中，我们无法使用布尔类型参数，但是我们有 Toggle 可以实现同样的功能。
这个绘制器可以让我们通过条件来切换状态。
要使用它，我们要先在中括号之间写一个 `Toggle`，然后声明属性，注意，这个属性必须是 `Float` 类型的。
它的默认值必须是一个 `Integer`，0 或 1，为啥？因为 0 象征“关”，而 1 象征“开”。

其语法如下：

``` hlsl
[Toggle] _PropertyName ("Display Name", Float) = 0
```

如你所见，我们在中括号内添加了 Toggle，并声明了属性，接着是显示名，然后是 Float 数据类型，最后我们初始化属性为“关”，因为我们将它的默认值设定为 0。

在使用这种绘制器的时候要注意，如果我们想在代码中实现它，需要使用 `#pragma shader_feature`。
这是一种着色器变体，它的功能是根据输入（启用或禁用）产生不同的状态。
要理解它的执行情况，我们需要做以下操作：

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties
  {
    _Color ("Color", Color) = (1, 1, 1, 1)
    // declare drawer Toggle 声明开关
    [Toggle] _Enable ("Enable ?", Float) = 0
  }

  SubShader
  {
    Pass
    {
      CGPROGRAM
      ...
      // declare pragma 声明 pragma
      #pragma shader_feature _ENABLE_ON
      ...
      float4 _Color;
      ...
      half4 frag (v2f i) : SV_Target
      {
        half4 col = tex2D(_MainTex, i.uv);

        // generate conditions 生成状态
      #if _ENABLE_ON
        return col;
      #else
        return col * _Color;
      #endif
      }
      ENDCG
    }
  }
}
```

在这个例子中，我们声明了一个 Toggle 类型的属性 `_Enable`。
接着我们将其添加到 CGPROGRAM 的 **shader_feature** 中，然而，不同于程序中的属性，Toggle 被声明为 `_ENABLE_ON`，为何如此？
添加到 shader_feature 变体中的变量是常量，因此是大写的，这意味着，如果我们的属性叫 `_Change`，那在着色器变体中，它需要添加为 `_CHANGE`。
而 **_ON** 对应 Toggle 的默认状态，因此，如果激活了 `_Enable` 属性，我们在片元着色阶段返回默认纹理颜色，否则我们将其乘上 `_Color` 属性。

值得一提的是，shader_feature 无法为一个应用编译多个变体，这是什么意思？
Unity 不会在最终构建中包含没有使用的变体，这意味着我们不能在运行时从一个状态移到另一个状态。
为此，我们得使用有“**multi_compile**”着色器变体的 KeywordEnum 绘制器。

### 3.4.2 MPD 关键字枚举

这种绘制器会在材质 inspector 中生成一个**弹出式**菜单。
不同于 Toggle，这种绘制器让我们可以为着色器配置 9 种不同的状态。
为此我们必须在中括号添加 `KeywordEnum`，然后列出我们要用到的状态集合。

``` hlsl
[KeywordEnum(StateOff, State01, etc...)]
  _PropertyName ("Display name", Float) = 0
```

这个例子中，我们在中括号中添加了 KeywordEnum 绘制器，然后列出了它的状态，这里第一个状态对应默认状态（StateOff）。
紧接着是属性的声明、在材质 inspector 种显示的名字、其 Float 数据类型和我们在最后初始化的默认值。

要在代码中声明这种绘制器，**shader_feature** 和 **multi_compile** 两种着色器变体都是可用的。
我们可以基于想要在最终构建中包含的变体数量来选择。

正如我们已经知道的，`shader_feature` 只会导出在材质 inspector 中选择的变体，而 `multi_compile` 则会导出所有在着色器中找到的变体，不论是否用到了它们。
有了这个特点，`multi_compile` 更适合导出或是编译多种会在执行期间改变的状态（如《超级马里奥》中的星星状态）。

为理解其实现，我们将执行以下操作：
``` hlsl
Shader "InscpectorPath/shaderName"
{
  Properties
  {
    // declare drawer Toggle
    [KeywordEnum(Off, Red, Blue)]
    _Options ("Color Options", Float) = 0
  }
  SubShader
  {
    Pass
    {
      CGPROGRAM
      ...
      // declare pragma and conditions
      #pragma multi_compile _OPTIONS_OFF _OPTIONS_RED _OPTIONS_BLUE
      ...
      half4 frag (v2f i) : SV_Target
      {
        half4 col = tex2D(_MainTex, i.uv);

        // generate conditions
      #if _OPTIONS_OFF
        return col;
      #elif _OPTIONS_RED
        return col * float4(1, 0, 0, 1);
      #elif _OPTIONS_BLUE
        return col * float4(0, 0, 1, 1);
      #endif
      }
      ENDCG
    }
  }
}
```

在这个例子中，我们声明了一个 KeywordEnum 类型属性，名为 `_Options`，并给它配置了三种状态（`Off`、`Red` 和 `Blue`）。
之后我们将他们添加到了 `CGPROGRAM` 中的 `multi_compile`，并将它们声明为常量。

``` hlsl
#pragma multi_compile _OPTIONS_OFF _OPTIONS_RED _OPTIONS_BLUE
```

最后使用这三种状态，我们为着色器定义了定义了这三种状态，对应改变主纹理的颜色。

### 3.4.3 MPD 枚举

Enum 绘制器和 KeywordEnum 很相似，区别在于它可以定义一个“值/id”作为参数，并将其传入着色器中，以在 inspector 中动态地改变其功能。

其语法如下：

``` hlsl
[Enum(valor, id_00, valor, id_01, etc ...)]
  _PropertyName ("Display Name", Float) = 0
```

`Enum` 不使用着色器变体，而是通过命令或函数来声明。
为了理解其实现，我们来执行下面的操作：

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties
  {
    // declare drawer 声明绘制器
    [Enum(Off, 0, Front, 1, Back, 2)]
    _Face ("Face Culling", Float) = 0
  }
  SubShader
  {
    // we use the property as a command 我们以命令的形式使用这个属性
    Cull [_Face]
    Pass {...}
  }
}
```

在给出的例子中，我们声明了一个 `Enum` 属性，名为 `_Face`，并将其值作为参数传递：Off：0、Front：1、Back：2。
之后我们将属性添加到子着色器中的 `Cull` 命令。
这样一来，我们就可以在 Unity 的 Inspector 中修改要渲染的物体表面。
在 [3.2.1 节]()==中我们会详细讲解 `Cull` 命令。==

### 3.4.4 MPD 指数滑块和整型范围

这些绘制器在处理数值范围和精度时很有用。
首先，我们可以用 `PowerSlider` 来生成用曲线控制的非线性的滑块。

其语法如下：

``` hlsl
[PowerSlider(3.0)] _PropertyName ("Display name", Range (0.01, 1)) = 0.08
```

另一方面，还有 `IntRange`，顾名思义，为整数值添加一个数字范围。

其语法如下：

``` hlsl
[IntRange] _Property ("Display name", Range (0, 255)) = 100
```

注意，如果我们想在着色器中使用这些属性，就要像传统属性一样声明在 `CGPROGRAM` 中。
要理解如何使用它，我们将执行以下操作：

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties
  {
    // declare drawer 声明绘制器
    [PowerSlider(3.0)]
    _Brightness ("Brightness", Range (0.01, 1)) = 0.08
    [IntRange]
    _Sample ("Samples", Range (0, 255)) = 100
  }
  SubShader
  {
    Pass
    {
      CGPROGRAM
      ...
      // generate connection variables 生成连接变量
      float _Brightness;
      int _Samples;
      ...
      ENGCG
    }
  }
}
```

在这个例子中，我们声明了名为 `_Brightness` 的 `PowerSlider` 和一个名为 `_Samples` 的 `IntRange`。
最后使用相同的名字在 `CGPROGRAM` 中生成连接变量。

### 3.4.5 MPD 空格和标题

最后这些绘制器在组织上很有帮助。

`Space` 让我们在两个属性之间添加空格。
如果我们像让属性之间在材质 Inspector 中有间隔，我们可以在它们中间添加这个绘制器。

其语法如下

``` hlsl
_PropertyName01 ("Display name", Float ) = 0
// we add the space 添加空格
[Space(10)]
_PropertyName02 ("Display name", Float ) = 0
```

在这个例子中，我们在属性 `_PropertyName01` 和属性 `_PropertyName02` 之间添加了 10 点空格。
同样的，顾名思义，`Header` 可以在 Unity 的 Inspector 中添加一个标题。
这在在属性中生成目录很有用。

其语法如下：

``` hlsl
// we add the header
[Header(Category name)]
_PropertyName01 ("Display name", Float ) = 0
_PropertyName02 ("Display name", Float ) = 0
```

在这个例子中，我们在属性之前添加了一个小标题，这个标题会显示在 Inspector 中。
要理解两个属性，我们将执行以下操作：

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties
  {
    [Header(Specular properties)]
    _Specularity ("Specularity", Range (0.01, 1)) = 0.08
    _Brightness ("Brightness", Range (0.01, 1)) = 0.08
    _SpecularColor ("Specular Color", Color) = (1, 1, 1, 1)
    [Space(20)]
    [Header(Texture properties)]
    _MainTex_ ("Texture", 2D) = "white" {}
  }
  SubShader {...}
}
```

## 3.5 ShaderLab 子着色器

着色器的第二个组件就是子着色器。
每个着色器由至少一个子着色器组成，以便完美加载程序。
当由不止一个子着色器时，Unity 会处理每个子着色器，并根据硬件特性从上到下选择最合适的一个。
为了理解这一点，假设着色器要在支持**金属图形**API（iOS）的硬件上运行。
为此，Unity 会运行第一个支持金属图形的子着色器。
如果一个子着色器不支持，Unity 会尝试使用对应一个默认着色器的回退组件，如此一来硬件就可以继续它的任务，而不会产生图形错误。

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties {...}
  SubShader
  {
    // shader configuration here 在这里编写着色器配置
  }
}
```

如果仔细看我们的 `USB_Simple_Color` 着色器，子着色器会默认像下面这样：

``` hlsl
Shader "USB_USB_simple_color"
{
  Properties {...}
  SubShader
  {
    Tags { "RenderType"="Opaque" }
    LOD 100

    Pass {...}
  }
}
```

### 3.5.1 子着色器标签

**标签**时显示我们的着色器如何以及何时处理的标签

就像 GameObject 的标签，这些可以用来识别一个着色器要如何渲染，或一组着色器有何种图形表现。

所有标签的语法如下：

``` hlsl
Tags
{
  "TagName1"="TagValue1"
  "TagName2"="TagValue2"
}
```

这些可以写在两种不同的域中，即 `SubShader` 中或 `Pass` 中。
这取决于我们想要获得的效果。
如果我们把标签写在 `SubShader` 中，它会影响 `SubShader` 中包含的所有 `Pass`，而如果我们把它写在 `Pass` 中，则它只会影响选中的 `Pass`。

`Queue` 是一种我们经常用到的标签，因为它让我们可以定义物体表面的外观。
默认情况下，所有的表面都被定义为 `opaque`，即它们不透明。

看看我们的 `USB_simple_shader`，我们会在子着色器中找到这一行代码，它将我们的着色器定义为不透明。

``` hlsl
SubShader
{
  Tags { "RenderType"="Opaque" }
  LOD 100

  Pass {...}
}
```

#### 3.5.1.1 Queue 标签

默认情况下，这种标签并不会以代码的形式出现。
这是因为其默认在 GPU 上编译，它直接关联到每个材质的物体处理顺序。

``` hlsl
Tags { "Queue"="Geometry" }
```

这种标签和摄像机及 GPU 有着紧密的联系。

每次在场景中放置一个物体，我们都会将其信息发送给 GPU（如顶点位置、法线、颜色等）。
在**游戏视图**也是一样的，只是我们发送给 GPU 的信息对应于摄像机视锥体内的物体。
一旦信息进入 GPU，我们将这些数据发送给 VRAM，并让其在屏幕上绘制物体。

绘制物体的过程叫做“**绘制调用**”（Draw Call）。
着色器有越多的通道，在渲染时的绘制调用就越多。
一个通道就相当于一次绘制调用，因此，如果我们有一个两通道的着色器，那这个材质只会在 GPU 上产生两次*绘制调用*。

那么，GPU是如何将这些物体绘制到屏幕上的呢？
简单来说，GPU 会先绘制离摄像机最远的物体，而最近的元素会在最后绘制。
此计算将依据物体与摄像机在其 Z 轴上距离。

![图 3.5.1.1a 如图所示，由于方形离摄像机最远，因此会最先绘制在屏幕上。最后绘制三角形，一共产生 2 次绘制调用](/unityshaderbible/61-0.png)

Unity 有一个称为“**渲染队列**”（Render Queue）的处理队列，他让我们可以修改物体在 GPU 上的处理顺序。
有两种方法可以修改渲染队列：

1. 通过 Inspector 中的材质属性。
2. 或使用 `Queue` 标签。

如果我们在着色器中修改 `Queue` 的值，材质中*渲染队列*的默认值也会一并修改。

这个属性是一个顺序值，取值范围在 0 到 5000 之间，其中 0 表示最远的元素，而5000表示离摄像机最近的元素。
这些顺序值有预定义的组，它们是：

* **Background**
* **Geometry**
* **AlphaTest**
* **Transparent**
* **Overlay**

`Tags { "Queue"="Background" }` 取值 0~1499，默认为 1000；  
`Tags { "Queue"="Geometry" }` 取值 1500~2399，默认为 2000；  
`Tags { "Queue"="AlphaTest" }` 取值 2400~2699，默认为 2450；  
`Tags { "Queue"="Transparent" }` 取值 2700~3599，默认为 3000；  
`Tags { "Queue"="Overlay" }` 取值 3600~5000，默认为 4000；

**Background** 主要用于那些离摄像机非常远的元素，如天空盒；  

**Geometry** 是队列中的默认值，用于场景中的不透明物体（如基本体和常规物体）。

**AlphaTest** 用于必须先是在不透明物体前，但要显示在透明物体之后的半透明物体（如玻璃、草、植被）。

**Transparent** 用于必须显示在其他元素前面的透明元素。

最后，**Overlay**对应那些在场景中显示在最前面的元素（如 UI、图片）。

``` hlsl
Shader "InspectorPath/shaderName"
{
  Properties {...}
  SubShader
  {
    Tags { "Queue"="Geometry" }
  }
}
```

HDRP 和内置 RP 使用渲染队列的方式有所不同，因为材质不会直接在 Inspector 中展示这个属性，而是引入了 2 种控制方式，它们是：

* 材质顺序
* 渲染顺序

HDRP 使用这两种排序方法来控制物体的处理。

#### 3.5.1.2 RenderType 标签

根据 Unity 官方文档，

> 使用 `RenderType` 标签可覆盖 Shader 对象的行为。[^1]

上面的说法是什么意思？
基本上，使用这些标记，我们可以在子着色器中改变状态，在与给定类型匹配的任何材质上添加效果。

为了实现其功能，我们需要至少两个着色器：

1. 一个替换的（我们想要在运行时添加的颜色或效果）
2. 一个要被替换的（指定给材质的着色器）

其语法如下：

``` hlsl
Tags { "RenderType"="type" }
```

和 Queue 标签一样，RenderType 也有不同的可配置值，这些值取决于我们想执行的任务。
其中有：

* **Opaque**（默认）
* **Transparent**
* **TransparentCutout**
* **Background**
* **Overlay**
* **TreeOpaque**
* **TreeTransparentCutout**
* **TreeBillboard**
* **Grass**
* **GrassBillboard**

每次我们创建新着色器时，都会默认设置为 `Opaque` 。
同样，大多数 Unity 中的内置着色器都被设为了这个值，因为它们没有透明度的配置。
然而，我们可以自由地改变这个属性，一切都取决于我们想要应用的效果。

要彻底理解这个概念，我们要做以下的事。
在我们的工程中，

1. 我们要确保在场景中创建一些 3D 物体。
2. 我们要创建一个 C# 脚本，名为 `USBReplacementController`。
3. 之后我们要创建一个着色器，名为 `USB_replacement_shader`。
4. 最后，我们要添加一个材质，名为 `USB_replaced_mat`。

我们要使用 `Camera.SetReplacementShader` 来为材质 `USB_replaced_mat` 动态指定着色器。
要实现这个功能，材质着色器必须有一个 `RenderType` 标签和替换着色器相同。

为了演示，我么为 `USB_replaced_mat` 指定 `Mobile/Unlit`。
这个内置着色器配置 `RenderType` 为 `Opaque`。
因此，着色器 `USB_replacement_shader` 必须匹配相同的 `RenderType` 才能执行操作。

![图 3.5.1.2a 将 Unlit 着色器（支持光照贴图）指定给 `USB_replaced_mat` 材质](/unityshaderbible/65-0.png)

`USBReplacementController` 脚本必须直接作为组件挂载到摄像机。
这个控制器负责替换着色器，只要他们的 `RenderType` 配置相同即可。

``` cs
using System.Collection;
using System.Collection.Generic;
using UnityEngine;

[ExecuteInEditMode]
public class USBReplacementController : MonoBehaviour
{
    // replacement shader
    public Shader m_replacementShader;

    private void OnEnable()
    {
        if (m_replacementShader != null)
        {
            // the camera will replace all the shaders in the scene with the replacement one the "RenderType" configuration must match in both shader
            GetComponent<Camera>().SetReplacementShader(
                m_replacementShader, "RenderType"
            );
        }
    }

    private void OnDisable()
    {
        // let's reset the default shader
        GetComponent<Camera>().ResetReplacementShader();
    }
}
```

值得一提的是，我们在类上方定义了 `[ExecuteInEditMode]` 功能。
这个属性让我们可以在编辑模式预览变化。

我们使用 **USB_replacement_shader** 作为替换着色器。

正如我们所知，每次我们创建一个新的着色器，它都会配置其 `RenderType` 为 `Opaque`。
因此，**USB_replacement_shader** 可以替换掉我们先前指定给材质的 Unlit 着色器。

为了让变化清晰可见，我们将在 **USB_replacement_shader** 的片元着色器阶段添加红色，乘上输出颜色。

``` hlsl
fixed4 frag (v2f i) : SV_Target
{
  fixed4 col = tex2D(_MainTex, i.uv);
  // add a red color 添加红色
  fixed4 red = fixed4(1, 0, 0, 1);
  return col * red;
}
```

我们要确保在 **USBReplacementController** 脚本的着色器类型的替换变量中引用 **USB_replacement_shader** 。

![图 3.5.1.2b USBReplacementController 已指定给摄像机](/unityshaderbible/67-0.png)

此外，那些我们之前添加到场景中的物体必须有材质 **USB_replaced_mat**。

![图 3.5.1.2c 材质 USB_replaced_mat 已指定到 3D 物体上，包括一个平面、一个盒体和一个球体](/unityshaderbible/67-1.png)

因为 `USBReplacementController` 类已包含 `OnEnable` 和 `OnDisable` 函数，如果我们激活或停用脚本，我们就能看见内置着色器 Unlit 是如何在编辑模式替换为 USB_replacement_shader 的，在渲染时应用了红颜色。

![图 3.5.1.2d USB_replacement_shader 在最终渲染中替换了内置着色器 Unlit](/unityshaderbible/68-0.png)

### 3.5.2 子着色器混合

混合是将两个像素混合成一个的过程。
其指令在内置 RP 和可编程 RP 都是兼容的。

*混合*发生在名为“**合并**”（merging）的阶段，它将像素（指在片元着色器阶段处理过的像素）的最终颜色和它的深度结合。
这个阶段，发生在渲染管线的最后，在**片元着色器阶段**之后，也是执行模板缓冲、z 缓冲和颜色混合的阶段。

默认情况下，这个属性不会写在着色器中，因为这是一个可选功能，且主要用于我们处理透明物体时，例如，例如我们要在一个物体前绘制一个不透明度较低的像素时。

::: tip Alpha vs. Tranparency vs. Opacity
这三个是什么？好像经常会在见到用这些词来描述透明的物体，有什么区别呢？
* Transparency：透明度，简单来说，透明度越高，物体越透明。
* Opacity：有些地方也把它翻译为“透明度”，但正确的翻译应该是“不透明度”，因为 “Low Opacity”意为物体透明。
* Alpha：一般用在描述颜色时，RGBA 中的 A，表示**不透明度**。
:::

其默认值为“Blend Off”（关闭混合），但我们可以启动它来生成不同类型的*混合*，就像 PS 中的那样。

其语法如下：
``` hlsl
Blend [SourceFactor] [SestinationFactor]
```

`Blend` 是一个需要两个值进行运算的函数，这两个值称为“因子”（factors），根据一个算式算出屏幕上的最终颜色。
根据 Unity 官方文档，这个定义了混合值的算式如下：

> $B = SrcFactor * SrcValue [OP] DstFactor * DstValue$

要理解这个运算，我们要考虑如下：先发生**片元着色器阶段**，然后才是作为可选过程的**混合阶段**。

“**SrcValue**”（source value）已在**片元着色器阶段**处理，对应像素的 RGB 颜色输出。

“**DstValue**”（destination value）对应已经写入到“目标缓冲”（destination buffer）中的 RGB 颜色，也被称为渲染目标（render target）`SV_Target`。
当着色器中的混合选项未激活时，SrcValue 会覆写 DstValue。
然而，如果我们激活这个运算，两种颜色会混合成一个新颜色，并覆写之前的 DstValue。

“**SrcFator**”（source factor）和“**DstFactor**”（destination factor）是可配置的三维向量。
它们的主要功能是修改 SrcValue 和 DstValue 的值以得到有趣的效果。

我们可以在 Unity 文档种找到的因子有：

* **Off**，禁用混合选项。
* **One**，`(1, 1, 1)`。
* **Zero**，`(0, 0, 0)`。
* **SrcColor** 等于 *SrcValue* 的 RGB 值。
* **SrcAlpha** 等于 *SrcValue* 的 Alpha 值。
* **OneMinusSrcColor**，1 减 *SrcValue* 的 RGB 值`(1 - R, 1 - G, 1 - B)`。
* **OneMinusSrcAlpha**，1 减 *SrcValue* 的 Alpha 值`(1 - A, 1 - A, 1 - A)`。
* **DstColor** 等于 *DstValue* 的 RGB 值。
* **DstAlpha** 等于 *DstValue* 的 Alpha 值。
* **OneMinusDstColor**，1 减 *DstValue* 的 RGB 值`(1 - R, 1 - G, 1 - B)`。
* **OneMinusDstAlpha**，1 减 *DstValue* 的 Alpha 值`(1 - A, 1 - A, 1 - A)`。

### 3.5.3 子着色器 AlphaToMask
### 3.5.4 子着色器 ColorMask
### 3.5.5 子着色器 Culling 和深度测试
### 3.5.6 子着色器 Cull
### 3.5.7 子着色器 ZWrite
### 3.5.8 子着色器 ZTest
### 3.5.9 子着色器 Stencil
## 3.6 子着色器通道
### 3.6.1 CGPROGRAM / ENDCG
### 3.6.2 数据类型
### 3.6.3 Cg / HLSL Pragmas
### 3.6.4 Cg / HLSL Include
### 3.6.5 Cg / HLSL 顶点输入与顶点输出
### 3.6.6 Cg / HLSL 变量和关联向量
### 3.6.7 Cg / HLSL 顶点着色器阶段
### 3.6.8 Cg / HLSL 片元着色器阶段
## 3.7 子着色器回退

[^1]: [ShaderLab 向子着色器分配标签 - Unity 手册](https://docs.unity.cn/cn/current/Manual/SL-SubShaderTags.html)