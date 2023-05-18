import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "舒服家",
      description: "舒服嘉的个人主页",
    },
    "/en-US/": {
      lang: "en-US",
      title: "SaltSakiYa",
      description: "SaltSakya's homepage",
    },
  },

  theme,
  markdown:{
    headers:{
      level: [2, 3, 4, 5]
    }
  }
  // Enable it with pwa
  // shouldPrefetch: false,
});
