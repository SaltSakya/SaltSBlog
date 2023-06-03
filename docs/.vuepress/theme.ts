import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";

const MR_HOPE_AVATAR =
  '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="m18.68 10.74a26.63 26.63 0 0 1 11.25-3.53c4.25-.21 8.15.79 13.56 3.38s8.4 5.06 10.69 9.31 3.53 7.38 2.28 12.91-1.63 11.09-3.85 14.93-5.93 6.5-11.43 7.88-13.32 2.28-20.07-1.44-11.5-9.25-13.25-16.9-.31-11.63 1-15.22a23.64 23.64 0 0 1 9.82-11.32z" fill="#1d1d1b"/><path d="m20.55 11.31a22.85 22.85 0 0 1 7.69-2.6c4-.47 10.47 1.32 11.15 1.63s1.25.5 1 .69-2.53 2.18-3.34 2.31-3.62-.56-5.75-.47-3.56.5-4.59.5-2.5-1.13-3.5-1.22-3.13-.59-2.66-.84z" fill="#4eae4d"/><path d="m18.58 12.87a5.82 5.82 0 0 1 4.16.34c1.62.88 1.44 1.25 3.65 1.22s3.29-.4 3.94-.25 3.41 1.35 5.85.88a10.42 10.42 0 0 0 4.28-1.75c.72-.47 1.15-1.25 1.59-1.19s4.41 2.41 4.34 2.66a4.52 4.52 0 0 1 -1.71 1.5 7.43 7.43 0 0 0 -2.79 3.46c-.5 1.47-.78 5.88-.12 6.32s2.34-.19 3 .31.81 2.06 1.91 2.19 1.56-.69 2.56 0 1 1.21 2.56 1.25 3-.32 3.09 0a2.47 2.47 0 0 1 -.12 1.43c-.16.1-5.44.72-6.69.79s-1 .34-1.69 0-1.78-1.63-3.39-1.88-6.53-.56-7.5-.56-1.25 0-1.35.47.1 5.18-.4 6.72-.16 4.06 1.65 4.78 3.69 1.09 3.94 1.75 1.13 5 1.91 6.47 1.87 3.15 1.5 3.46a20.31 20.31 0 0 1 -6 1.54 23.64 23.64 0 0 1 -5.78 0s-1.16-6-1.47-6.54a4.67 4.67 0 0 1 -.41-2.34c.13-.41 2.34-4.87 2.06-6s-.72-2.28-1.75-2.56-2.75 0-5.53 0a27.84 27.84 0 0 1 -5.34-.44c-.56-.12-.88 0-1.13-.28s-2.28-4-2-4.34 3.13-1.16 3.25-1.82-.06-2.25.66-2.31 3.87.38 4.87-.15 1.13-1.75 1.16-2.82-.37-3.4-.84-3.84-5-1.81-6.72-2.72-3.17-1.62-2.98-2.22a12.45 12.45 0 0 1 3.78-3.53z" fill="#85bfe9"/><path d="m20.49 15c.54-.07.59.35.4.72s0 1.72.6 1.69a55.56 55.56 0 0 1 6.4-1.06 26.38 26.38 0 0 1 8 1.65c.75.41 1.1 2 1.16 2.47a29.44 29.44 0 0 1 -2.75 5.53c-.28.15-3.19-1-5.28-2s-3-1.47-3.09-1.88a6.23 6.23 0 0 0 -.5-1.69c-.19-.09-3-.28-4.35-1.09s-2.56-2.13-2.31-2.69a4.18 4.18 0 0 1 1.72-1.65z" fill="#1d1d1b"/><path d="m24.36 17.87a20.8 20.8 0 0 1 7.25.31c3.19.63 3.69 1.16 3.6 1.94s-1.28 4-1.72 3.84a41.78 41.78 0 0 1 -5.31-2.18c-.22-.32-.29-1.88-1.22-2.16s-2.88-.88-3.53-1.13-.5-.5-.35-.5 1.28-.12 1.28-.12z" fill="#4eae4d"/><path d="m47.58 15.21c.21-.07 2.94 1.07 4.81 4.63s2.47 7.94 2.25 8.34-.9.44-1.53.25-3.11-1.56-3.65-1.56-1.41.47-1.78 0-1.5-1.87-2.63-1.87-1.37.19-1.56-.06-.81-5.53.37-6.5 2.22-1.59 2.69-2 .75-1.13 1.03-1.23z" fill="#4eae4d"/><path d="m35.71 31c.36 0 5.72-.4 6.78.63s1.94 2.15 2.84 2.12 9.19-.75 9.19-.43-.94 7.5-2.38 11.15a15.91 15.91 0 0 1 -5.53 7.06c-1.15.66-2.34.91-2.43.72a21.82 21.82 0 0 1 -2.29-5.93c-.68-3.22-.87-4.72-1.93-5s-3.69-.9-4.19-1.53a4 4 0 0 1 -.56-1.87s.28-3.88.28-4.72.03-2.2.22-2.2z" fill="#4eae4d"/><path d="m17.43 38.21a12.74 12.74 0 0 0 4.84.91c3.31.06 6.56-.31 6.91.09s.28 1.78-.44 3.1a21.38 21.38 0 0 0 -1.19 2.59 26.16 26.16 0 0 0 -3.16-2.5.59.59 0 0 0 -.34.69c.13.28 3 2.22 3.13 2.47a9.75 9.75 0 0 1 -.1 1.75 25.76 25.76 0 0 0 -3-2.38c-.37-.06-.62.85-.5 1s3.53 2.5 4 2.91a6.06 6.06 0 0 1 .84 2.53c-.09 0-3.9-3.09-4.12-3.13s-.28 1-.28 1 4.5 3.19 4.65 3.44a6.49 6.49 0 0 1 .44 1.88 32.57 32.57 0 0 1 -3.59-.91c-1.25-.47-2.35-.72-2.35-.81s-1.17-3.78-2.81-5.38a12.91 12.91 0 0 1 -2.36-2.65 31.09 31.09 0 0 1 -.35-3.72c-.04-.85-.41-2.88-.22-2.88z" fill="#4eae4d"/><path d="m10.52 38.4c.19-.37 2.56.25 3.69.69s1.5 1 1.53 1.87-.13 4.66.65 5.35a10.71 10.71 0 0 1 3.07 3.28 7.26 7.26 0 0 1 1 2.19 20.15 20.15 0 0 1 -5.91-5.5c-3.19-4.13-4.12-7.69-4.03-7.88z" fill="#85bfe9"/><path d="m9.61 36.18a17.66 17.66 0 0 1 -.12-9.65c1.37-5.69 4-8.72 4.22-8.69s5.4 3 7.5 4 2.22 1 2.37 1.44a10.13 10.13 0 0 1 -.19 3.34c-.18.09-3.93-.09-5 0s-1.39 1.59-1.31 2.19.13.87-.12 1.06-3.6 1.09-3.78 2 2.37 5.37 2 5.5-4.57-.16-5.57-1.19z" fill="#4eae4d"/><g fill="#1d1d1b"><path d="m11.36 25.18a19.09 19.09 0 0 1 1.16-3.65c.5-.75.72-.91.94-.85s.84.35.78.53-1.13 2.25-1.41 3.16 0 .91-.4 1-.94.03-1.07-.19z"/><path d="m40 15.59c.16-.14 2.53-.72 2.69-.5s.34.44.18.56a11.75 11.75 0 0 1 -2.62.94c-.2-.1-.45-.85-.25-1z"/><path d="m38.46 22.93c.15.16 1.47 2.28 1.31 2.47s0 .47-.34.31a6.24 6.24 0 0 1 -1.54-2.22c.11-.25.57-.56.57-.56z"/><path d="m37 24.37a12.18 12.18 0 0 1 1.72 2.09c0 .19 0 .47-.31.38a8.07 8.07 0 0 1 -1.86-1.84c0-.16.45-.66.45-.63z"/><path d="m49.33 19.65a7.18 7.18 0 0 1 2.5 1.22c0 .19.1.69-.15.59s-2.54-1-2.63-1.12.25-.66.28-.69z"/><path d="m49.11 22c.08-.11 4 2.18 4 2.53s.35.59-.06.53a30.17 30.17 0 0 1 -4.25-2.16c-.12-.19.2-.75.31-.9z"/><path d="m48.74 24a25.43 25.43 0 0 1 4.84 2.62c.06.28.28.59-.12.56a40.58 40.58 0 0 1 -4.94-2.37c-.09-.13.09-.75.22-.81z"/><path d="m49.68 35.53a13.17 13.17 0 0 1 2.9 2.78c-.09.25 0 .37-.28.28a22.37 22.37 0 0 1 -3.12-2.72c.06-.16.34-.28.5-.34z"/><path d="m48.11 37.43a28.41 28.41 0 0 1 3.35 3.16c0 .25-.13.47-.25.44a41.72 41.72 0 0 1 -3.44-3 4.75 4.75 0 0 1 .34-.6z"/><path d="m47.11 39.46a23.35 23.35 0 0 1 3.35 3.32c-.07.25.06.4-.25.37a39.21 39.21 0 0 1 -3.53-3.15 3.19 3.19 0 0 1 .43-.54z"/><path d="m46.33 41.12a29.14 29.14 0 0 1 3.41 3.28c0 .25-.1.41-.22.31a43.92 43.92 0 0 1 -3.84-3.09.84.84 0 0 1 .65-.5z"/><path d="m45.71 44.12a16 16 0 0 1 3.06 2.72c0 .22-.16.37-.25.34a33.63 33.63 0 0 1 -3.19-2.5c-.03-.19.31-.53.38-.56z"/><path d="m45 45.93c.17 0 3.25 2.69 3 2.94s-.12.37-.37.28a22.27 22.27 0 0 1 -3.13-2.69c.11-.15.33-.53.5-.53z"/><path d="m35.18 43.43c.09-.14 1.31.31 1.28.6s0 .34-.16.34a5 5 0 0 1 -1.53-.44c0-.12.34-.4.41-.5z"/><path d="m33.14 47.28a1.46 1.46 0 0 1 1.16 0c.47.22 1.16 1 1.78 1.1s1.1-.28 1.25-.19a.37.37 0 0 1 .16.47c-.1.16-.16.31-.41.37a2 2 0 0 1 -1.5-.15c-.58-.39-.94-.88-1.58-.88s-.57.12-.69 0-.42-.51-.17-.72z"/><path d="m26 40.15c.25.16 2.06 1.75 2 2s-.19.5-.38.44a10.1 10.1 0 0 1 -2.15-1.82c-.01-.24.53-.62.53-.62z"/><path d="m24.21 30.43c.12 0 2.81 4.19 2.59 4.41s-.34.44-.47.31a44.75 44.75 0 0 1 -2.84-4.34 1.31 1.31 0 0 1 .72-.38z"/><path d="m25.24 30c0-.12.59-.38.78-.19a12 12 0 0 1 1.37 2.72c-.09.18 0 .47-.25.28a17.6 17.6 0 0 1 -1.9-2.81z"/><path d="m30.74 29.71c.08-.11 1-1 1.28-1s1 0 .91.22-1.41 1.91-1.66 1.75a1.66 1.66 0 0 1 -.53-.97z"/></g></svg>';

export default hopeTheme({
  hostname: "https://saltsakya.github.io",

  author: {
    name: "舒服嘉",
    url: "https://saltsakya.github.io",
    email: "SaltSakya@Yahoo.com",
  },

  iconAssets: [
    "iconfont",
    "//at.alicdn.com/t/c/font_4075628_z657y6qr5vr.css"
  ],

  iconPrefix: "iconfont icon-",

  logo: "/logo.svg",

  repo: "vuepress-theme-hope/vuepress-theme-hope",

  docsDir: "docs",

  blog: {
    medias: {
      Baidu: "https://example.com",
      BiliBili: "https://example.com",
      Bitbucket: "https://example.com",
      Dingding: "https://example.com",
      Discord: "https://example.com",
      Dribbble: "https://example.com",
      Email: "mailto:info@example.com",
      Evernote: "https://example.com",
      Facebook: "https://example.com",
      Flipboard: "https://example.com",
      Gitee: "https://example.com",
      GitHub: "https://example.com",
      Gitlab: "https://example.com",
      Gmail: "mailto:info@example.com",
      Instagram: "https://example.com",
      Lark: "https://example.com",
      Lines: "https://example.com",
      Linkedin: "https://example.com",
      Pinterest: "https://example.com",
      Pocket: "https://example.com",
      QQ: "http://wpa.qq.com/msgrd?v=3&uin=791969004&site=qq&menu=yes",
      Qzone: "https://example.com",
      Reddit: "https://example.com",
      Rss: "https://example.com",
      Steam: "https://example.com",
      Twitter: "https://example.com",
      Wechat: "https://example.com",
      Weibo: "https://example.com",
      Whatsapp: "https://example.com",
      Youtube: "https://example.com",
      Zhihu: "https://example.com",
      U: ["/project_ultraman", MR_HOPE_AVATAR],
    },
  },

  locales: {
    "/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "变得更好，变得更强！",

      displayFooter: true,

      blog: {
        description: "一个有梦想的游戏客户端开发者",
        intro: "/intro.html",
      },

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },

    /**
     * English locale config
     */
    "/en-US/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "Be better, be stronger! ",

      displayFooter: true,

      blog: {
        description: "A Game Client developer with dream",
        intro: "/en-US/intro.html",
      },

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/zh/demo/encrypt.html": ["1234"],
    },
  },

  plugins: {
    blog: true,
    
    autoCatalog: true,

    comment: {
      provider: "Giscus",
      repo: "SaltSakya/SaltSakya.github.io",
      repoId: "R_kgDOIDHxWQ",
      category: "General",
      categoryId: "DIC_kwDOIDHxWc4CWfGh",
    },
    
    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "public",
          replacer: ({ tag }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { type: "tip", vertical: "middle"},
                content: "公开",
              };
          },
        },
        {
          matcher: "protected",
          replacer: ({ tag }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { type: "warning", vertical: "middle"},
                content: "保护",
              };
          },
        },
        {
          matcher: "private",
          replacer: ({ tag }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { type: "danger", vertical: "middle"},
                content: "私有",
              };
          },
        },
        {
          matcher: "virtual",
          replacer: ({ tag }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "MediumPurple", vertical: "middle"},
                content: "虚",
              };
          },
        },
        {
          matcher: "static",
          replacer: ({ tag }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "MediumPurple", vertical: "middle"},
                content: "静态",
              };
          },
        },
        {
          matcher: "readonly",
          replacer: ({ tag }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "MediumPurple", vertical: "middle"},
                content: "只读",
              };
          },
        },
        {
          matcher: /^class:(.*)$/,
          replacer: ({ tag, content, }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "MediumTurquoise", vertical: "middle"},
                content: content.substring(6, content.length)
              };
          },
        },
        {
          matcher: /^enum:(.*)$/,
          replacer: ({ tag, content, }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "YellowGreen", vertical: "middle"},
                content: content.substring(5, content.length)
              };
          },
        },
        {
          matcher: /^struct:(.*)$/,
          replacer: ({ tag, content, }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "LimeGreen", vertical: "middle"},
                content: content.substring(7, content.length)
              };
          },
        },
        {
          matcher: /^type:(.*)$/,
          replacer: ({ tag, content, }) => {
            if (tag === "em"||tag === "strong")
              return {
                tag: "Badge",
                attrs: { color: "CornflowerBlue", vertical: "middle"},
                content: content.substring(5, content.length)
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
      
      tasklist: true,
      container: true
    },

    // uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
