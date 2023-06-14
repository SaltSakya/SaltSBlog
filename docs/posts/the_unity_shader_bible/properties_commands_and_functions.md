---
title: 属性、命令和函数
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
