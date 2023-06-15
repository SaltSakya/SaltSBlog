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
      text: "游戏程序高级知识",
      icon: "study",
      prefix: "game_dev/advance/",
      children: "structure",
    },
    {
      text: "Unity 着色器圣经",
      icon: "repo",
      prefix: "the_unity_shader_bible/",
      link: "the_unity_shader_bible/",
      children: "structure",
    },
    {
      text: "其他文章",
      icon: "note",
      prefix: "posts/others/",
      children: "structure",
    },
    //"intro",
    //"slides",
  ],
});
