import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/en-US/": [
    "",
    {
      icon: "discover",
      text: "Demo",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    "intro",
    "slides",
  ],
});
