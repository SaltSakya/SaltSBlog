---
title: "Markdown 参考"
lang: "zh-CN"
description: ""

---
# VuePress Markdown 参考
## Markdoown 基础
### 标题语法
| Markdown 语法 | HTML | 预览效果 | 可选语法 |
| - | - | - | - |
|`# 一级标题`|`<h1>一级标题</h1>`|<h1>一级标题</h1>|第一行：`一级标题`<br>第二行：`==`|
|`# 二级标题`|`<h1>二级标题</h1>`|<h2>二级标题</h2>|第一行：`二级标题`<br>第二行：`--`|
|`# 三级标题`|`<h1>三级标题</h1>`|<h3>三级标题</h3>||
|`# 四级标题`|`<h1>四级标题</h1>`|<h4>四级标题</h4>||
|`# 五级标题`|`<h1>五级标题</h1>`|<h5>五级标题</h5>||
|`# 六级标题`|`<h1>六级标题</h1>`|<h6>六级标题</h6>||

### 段落语法与换行
| Markdown 语法 | HTML | 预览效果 |
| - | - | - |
|`撑着油纸伞，独自彷徨在悠长，悠长又寂寥的雨巷。`<br><br>`我希望飘过一个丁香一样地结着愁怨的姑娘。`|`<p>撑着油纸伞，独自彷徨在悠长，悠长又寂寥的雨巷。</p>`<br><br>`<p>我希望飘过一个丁香一样地结着愁怨的姑娘。</p>`|<p>撑着油纸伞，独自彷徨在悠长，悠长又寂寥的雨巷。</p><p>我希望飘过一个丁香一样地结着愁怨的姑娘。</p>|
换行有如下三种方式：
* **空白行**；
* `<br>` **标签**；
* **两个空格**（结尾空格）：不推荐，因为多数编辑器中，空格不可见，可能产生意外的换行。

### 强调语法
| 强调语法 | Markdown 语法 | HTML | 预览效果 |
|:-------:|:-------------:|:----:|:-------:|
|斜体（Italic）| `前*斜体*后` |`前<strong>斜体</strong>后`|前*斜体*后|
|粗体（Bold）| `前**斜体**后` |`前<em>斜体</em>后`|前**粗体**后|
|粗体（Bold）& 斜体（Italic）| `前***斜体***后` |`前<strong><em>斜体</em></strong>后`|前 ***粗斜体*** 后|
|删除线|`前~~删除部分~~后`||前~~删除部分~~后|

### 引用语法
``` markdown
> 这是引用的示例：
> 这样不能换行，引用内换行的方式与段落一致。
>
> 这样才行。
> * 无序列表语法
> * 无需列表可以不用空行
> 1. 有序列表
>> 嵌套引用
>
> 结束嵌套引用必须要有一个空行
```
> 这是引用的示例：
> 这样不能换行，引用内换行的方式与段落一致。
>
> 这样才行。
> * 无序列表语法
> * 无需列表可以不用空行
> 1. 有序列表
>> 嵌套引用
>
> 结束嵌套引用必须要有一个空行

### 列表语法
#### 有序列表
有序列表使用`数字`+`.`的形式，具体数字不影响渲染。
> 1. 1
> 2. 2
> 2. 2
> 1. 1
#### 无序列表
`+`、`-`、`*` 均可用于标记无序列表。
> * 1
> * 2
> * 3

### 代码语法
| Markdown 语法 | HTML | 预览效果 |
|:-------------:|:----:|:-------:|
|`At the commmand prompt, type ˋnanoˋ.`|`At the commmand prompt, type <code>nano</code>.`|At the commmand prompt, type `nano`.|
|``ˋˋUse ˋcodeˋ in your Markdown file.ˋˋ``|<code>Use ˋcodeˋ in your Markdown file.</code>|``Use `code` in your Markdown file.``|

### 分割线语法
连续三个或以上的星号`*`、减号`-`或下划线`_`：
***
---
___

### 链接语法
#### 链接的基本语法
链接的语法为`[<链接文字>](<url> "<提示文字>")`
示例：
``` markdown
右侧是一个链接[V我50](http://www.kfc.com.cn/kfccda/index.aspx "KFC")
```
渲染效果如下:
> 右侧是一个链接[V我50](http://www.kfc.com.cn/kfccda/index.aspx "KFC")

#### 网址和 Email 地址
通过加 `<>` 来将**链接**和**Email地址**渲染为链接形式
``` markdown
<https://prts.wiki/w/%E9%A6%96%E9%A1%B5>
<doctor@rhodesisland.com>
```
渲染效果如下：  
<https://prts.wiki/w/%E9%A6%96%E9%A1%B5>  
<doctor@rhodesisland.com>

#### 带格式化的链接
* 强调链接，前后加星号
* 将链接表示为代码，`[]`内部加`ˋ`
``` markdown
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).
```

### 图片语法
语法：`![<图像无法加载时的文字>]（<图像链接> "<图像提示>"）`

![归溟幽灵鲨时装立绘](https://prts.wiki/images/0/0d/%E7%AB%8B%E7%BB%98_%E5%BD%92%E6%BA%9F%E5%B9%BD%E7%81%B5%E9%B2%A8_skin1.png "归溟幽灵鲨：生而为一")
![Logo](/logo.png "Logo")  
图片语法和外部套一个链接语法，实现图片链接  
[![Markdown](https://markdown.com.cn/hero.png "Markdown")](https://markdown.com.cn/basic-syntax/ "点击查看 Markdown 官方网站")

### 转义字符语法
用反斜线`\`来显示被用于 Markdown 文档格式化的字符

## VuePress Markdown 扩展
### GitHub 风格的表格
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      | $12   |
| zebra stripes | are neat      | $1    |

### Emoji
:rofl::point_right:
::: details 部分可用列表
|                                |                                  |                                |                                  |
| ------------------------------:|:-------------------------------- | ------------------------------:|:-------------------------------- |
|100|:100:|1234|:1234:|
|grinning|:grinning:|smiley|:smiley:|
|smile|:smile:|grin|:grin:|
|laughing|:laughing:|satisfied|:satisfied:|
|sweat_smile|:sweat_smile:|rofl|:rofl:|
|joy|:joy:|slightly_smiling_face|:slightly_smiling_face:|
|upside_down_face|:upside_down_face:|wink|:wink:|
|blush|:blush:|innocent|:innocent:|
|heart_eyes|:heart_eyes:|kissing_heart|:kissing_heart:|
|kissing|:kissing:|relaxed|:relaxed:|
|kissing_closed_eyes|:kissing_closed_eyes:|kissing_smiling_eyes|:kissing_smiling_eyes:|
|yum|:yum:|stuck_out_tongue|:stuck_out_tongue:|
|stuck_out_tongue_winking_eye|:stuck_out_tongue_winking_eye:|stuck_out_tongue_closed_eyes|:stuck_out_tongue_closed_eyes:|
|money_mouth_face|:money_mouth_face:|hugs|:hugs:|
|thinking|:thinking:|zipper_mouth_face|:zipper_mouth_face:|
|neutral_face|:neutral_face:|expressionless|:expressionless:|
|no_mouth|:no_mouth:|smirk|:smirk:|
|unamused|:unamused:|roll_eyes|:roll_eyes:|
|grimacing|:grimacing:|lying_face|:lying_face:|
|relieved|:relieved:|pensive|:pensive:|
|sleepy|:sleepy:|drooling_face|:drooling_face:|
|sleeping|:sleeping:|mask|:mask:|
|face_with_thermometer|:face_with_thermometer:|face_with_head_bandage|:face_with_head_bandage:|
|nauseated_face|:nauseated_face:|sneezing_face|:sneezing_face:|
|dizzy_face|:dizzy_face:|cowboy_hat_face|:cowboy_hat_face:|
|sunglasses|:sunglasses:|nerd_face|:nerd_face:|
|confused|:confused:|worried|:worried:|
|slightly_frowning_face|:slightly_frowning_face:|frowning_face|:frowning_face:|
|open_mouth|:open_mouth:|hushed|:hushed:|
|astonished|:astonished:|flushed|:flushed:|
|frowning|:frowning:|anguished|:anguished:|
|fearful|:fearful:|cold_sweat|:cold_sweat:|
|disappointed_relieved|:disappointed_relieved:|cry|:cry:|
|sob|:sob:|scream|:scream:|
|confounded|:confounded:|persevere|:persevere:|
|disappointed|:disappointed:|sweat|:sweat:|
|weary|:weary:|tired_face|:tired_face:|
|triumph|:triumph:|rage|:rage:|
|pout|:pout:|angry|:angry:|
|smiling_imp|:smiling_imp:|imp|:imp:|
|skull|:skull:|skull_and_crossbones|:skull_and_crossbones:|
|hankey|:hankey:|poop|:poop:|
|shit|:shit:|clown_face|:clown_face:|
|japanese_ogre|:japanese_ogre:|japanese_goblin|:japanese_goblin:|
|ghost|:ghost:|alien|:alien:|
|space_invader|:space_invader:|robot|:robot:|
|smiley_cat|:smiley_cat:|smile_cat|:smile_cat:|
|joy_cat|:joy_cat:|heart_eyes_cat|:heart_eyes_cat:|
|smirk_cat|:smirk_cat:|kissing_cat|:kissing_cat:|
|scream_cat|:scream_cat:|crying_cat_face|:crying_cat_face:|
|pouting_cat|:pouting_cat:|see_no_evil|:see_no_evil:|
|hear_no_evil|:hear_no_evil:|speak_no_evil|:speak_no_evil:|
|kiss|:kiss:|love_letter|:love_letter:|
|cupid|:cupid:|gift_heart|:gift_heart:|
|sparkling_heart|:sparkling_heart:|heartpulse|:heartpulse:|
|heartbeat|:heartbeat:|revolving_hearts|:revolving_hearts:|
|two_hearts|:two_hearts:|heart_decoration|:heart_decoration:|
|heavy_heart_exclamation|:heavy_heart_exclamation:|broken_heart|:broken_heart:|
|heart|:heart:|yellow_heart|:yellow_heart:|
|green_heart|:green_heart:|blue_heart|:blue_heart:|
|purple_heart|:purple_heart:|black_heart|:black_heart:|
|anger|:anger:|boom|:boom:|
|collision|:collision:|dizzy|:dizzy:|
|sweat_drops|:sweat_drops:|dash|:dash:|
|hole|:hole:|bomb|:bomb:|
|speech_balloon|:speech_balloon:|eye_speech_bubble|:eye_speech_bubble:|
|right_anger_bubble|:right_anger_bubble:|thought_balloon|:thought_balloon:|
|zzz|:zzz:|wave|:wave:|
|raised_back_of_hand|:raised_back_of_hand:|raised_hand_with_fingers_splayed|:raised_hand_with_fingers_splayed:|
|hand|:hand:|raised_hand|:raised_hand:|
|vulcan_salute|:vulcan_salute:|ok_hand|:ok_hand:|
|v|:v:|crossed_fingers|:crossed_fingers:|
|metal|:metal:|call_me_hand|:call_me_hand:|
|point_left|:point_left:|point_right|:point_right:|
|point_up_2|:point_up_2:|middle_finger|:middle_finger:|
|fu|:fu:|point_down|:point_down:|
|point_up|:point_up:|+1|:+1:|
|thumbsup|:thumbsup:|-1|:-1:|
|thumbsdown|:thumbsdown:|fist_raised|:fist_raised:|
|fist|:fist:|fist_oncoming|:fist_oncoming:|
|facepunch|:facepunch:|punch|:punch:|
|fist_left|:fist_left:|fist_right|:fist_right:|
|clap|:clap:|raised_hands|:raised_hands:|
|open_hands|:open_hands:|handshake|:handshake:|
|pray|:pray:|writing_hand|:writing_hand:|
|nail_care|:nail_care:|selfie|:selfie:|
|muscle|:muscle:|ear|:ear:|
|nose|:nose:|eyes|:eyes:|
|eye|:eye:|tongue|:tongue:|
|lips|:lips:|
:::
### 目录
[[toc]]

### 自定义容器
::: tip
这是一个提示
:::
::: warning
这是一个警告
:::
::: danger
这是一个危险警告
:::
::: details
这是一个详情块，在 IE / Edge 中不生效
:::
::: tip 自定义的提示标题
这是一个提示
:::
### 代码块及高亮代码块
输入
``` markdown
``` python
print("Hello world")
ˋˋˋ
```
输出
``` python
print("Hello world")
```
### 高亮代码块
输入
``` markdown
``` python {1,4,6-11} //注意，这里大括号内不能有空格
class ChatGPT8:

    def GetKeyword(self, msg):
        return None

    def OnRecieveMsg(self, msg):
        keyword = self.GetKeyword(msg)
        if keyword:
            return "好啊，{}好啊".format(keyword)
        else:
            return "牛啊"
ˋˋˋ
```
输出
``` python {1,4,6-11}
class ChatGPT8:

    def GetKeyword(self, msg):
        return None

    def OnRecieveMsg(self, msg):
        keyword = self.GetKeyword(msg)
        if keyword:
            return "好啊，{}好啊".format(keyword)
        else:
            return "牛啊"
```
