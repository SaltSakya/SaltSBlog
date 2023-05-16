import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "如何使用",
      icon: "creative",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文章",
      icon: "note",
      prefix: "posts/",
      children: "structure",
    },
    {
      text: "游戏程序高级知识",
      icon: "study",
      prefix: "game_adv_knlg/",
      children: "structure",
    },
    {
      text: "其他文章",
      icon: "note",
      prefix: "others/",
      children: "structure",
    },
    "intro",
    "slides",
  ],
});
