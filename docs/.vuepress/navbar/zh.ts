import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  { text: "演示", icon: "discover", link: "/demo/" },
  {
    text: "游戏开发",
    icon: "game",
    prefix: "/game_dev/",
    children: [
      {
        text: "基础",
        icon: "generic",
        prefix: "basic/",
        children: [
          
        ],
      },
      {
        text: "高级",
        icon: "advance",
        prefix: "advance/",
        children: [
          { text: "地图框架", icon: "sitemap", link: "NavMap" },
        ],
      },
      {
        text: "TA",
        icon: "advance",
        prefix: "advance/",
        children: [
          { text: "Unity 着色器圣经", icon: "repo", link: "the_unity_shader_bible" },
        ],
      },
    ]
  },
  {
    text: "其他",
    icon: "note",
    prefix: "/posts/",
    children: [
      {
        text: "其他",
        icon: "others",
        prefix: "others/",
        children: [
          { text: "代抽研究", icon: "software", link: "ArknightsDrawAgent" },
        ],
      },
    ]
  },
  {
    text: "V2 文档",
    icon: "note",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
