import { defineConfig } from "vitepress";
const fs = require("fs");
const path = require("path");

export default defineConfig({
  lang: "en-US",
  title: "ViteLearn",
  description: "Vite & Vue powered static site generator.",

  lastUpdated: true,
  cleanUrls: true,
  scrollOffset: 80,
  head: [["meta", { name: "theme-color", content: "#3c8772" }]],

  themeConfig: {
    outlineTitle: "目录",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    lastUpdatedText: "最近更新时间",
    nav: nav(),
    sidebar: getSidebar() as any,

    editLink: {
      pattern:
        "https://github.com/One-Punch-Superman/vitePress-template/edit/master/:path",
      text: "在 GitHub 上编辑此页",
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/One-Punch-Superman/vitePress-template",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Evan You",
    },

    algolia: {
      appId: "8J64VVRP8K",
      apiKey: "a18e2f4cc5665f6602c5631fd868adfd",
      indexName: "vitepress",
    },
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: 8080,
      open: true,
    },
  },
});

function nav() {
  return [
    {
      text: "Js",
      activeMatch: "/js/",
      link: "/js/01-var,let,const有什么区别",
    },
    {
      text: "Vue",
      activeMatch: "/vue/",
      link: "/vue/01-Vue项目搭建初始化",
    },
    {
      text: "Vue Router",
      activeMatch: "/vue-router/",
      link: "/vue-router/入门",
    },
    {
      text: "Pinia",
      activeMatch: "/pinia/",
      link: "/pinia/安装",
    },
    {
      text: "Vite",
      activeMatch: "/vite/",
      link: "/vite/安装",
    },
    {
      text: "VitePress",
      activeMatch: "/vitePress/",
      link: "/vitePress/应用配置",
    },
  ];
}

function getSidebar() {
  return {
    "/js/": generateSidebarItems("js"),
    "/vue/": generateSidebarItems("vue"),
    "/vue-router/": generateSidebarItems("vue-router"),
    "/pinia/": generateSidebarItems("pinia"),
    "/vite/": generateSidebarItems("vite"),
    "/vitePress/": generateSidebarItems("vitePress"),
  };
}

function generateSidebarItems(basePath = "") {
  const items = [];
  const dirPath = path.join(__dirname, "../" + basePath);
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const name = file.replace(".md", "");
    const relativePath = path.join(basePath, file);

    if (file.endsWith(".md")) {
      const item = {
        text: formatTitle(name),
        link: `/${relativePath.replace(/\\/g, "/").replace(".md", "")}`,
      };
      items.push(item);
    }
  }
  console.log("item", items);
  return items;
}

function formatTitle(str: any) {
  if (str.split("-").length > 1) {
    return str.split("-").slice(1).join("-");
  }
  return str;
}
