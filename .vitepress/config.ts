import { createRequire } from "module";
import { defineConfig } from "vitepress";

const require = createRequire(import.meta.url);
const pkg = require("vitepress/package.json");

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

    sidebar: {
      "/vue/": sidebarVue(),
      "/vue-router/": sidebarVueRouter(),
      "/pinia/": sidebarPinia(),
      "/vite/": sidebarVite(),
      "/vitePress/": sidebarVitePress(),
    },

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

    carbonAds: {
      code: "CEBDT27Y",
      placement: "vuejsorg",
    },
  },
});

function nav() {
  return [
    {
      text: "Vue",
      activeMatch: "/vue/",
      link: "/vue/Vue项目搭建初始化",
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

function sidebarVue() {
  return [
    {
      text: "基础",
      collapsed: false,
      items: [
        { text: "Vue项目搭建初始化", link: "/vue/Vue项目搭建初始化" },
        { text: "生命周期", link: "/vue/生命周期" },
        { text: "组件通信", link: "/vue/组件通信" },
        { text: "响应式原理", link: "/vue/响应式原理" },
        { text: "虚拟DOM", link: "/vue/虚拟DOM" },
        { text: "diff算法", link: "/vue/diff算法" },
        { text: "key的作用", link: "/vue/key的作用" },
        { text: "nextTick", link: "/vue/nextTick" },
      ],
    },
  ];
}

function sidebarVueRouter() {
  return [
    {
      text: "基础",
      collapsed: false,
      items: [{ text: "入门", link: "/vue-router/入门" }],
    },
  ];
}

function sidebarPinia() {
  return [
    {
      text: "介绍",
      collapsed: false,
      items: [{ text: "安装", link: "/pinia/安装" }],
    },
  ];
}

function sidebarVite() {
  return [
    {
      text: "基础",
      collapsed: false,
      items: [{ text: "安装", link: "/vite/安装" }],
    },
  ];
}

function sidebarVitePress() {
  return [
    {
      text: "配置",
      collapsed: false,
      items: [
        { text: "应用配置", link: "/vitePress/应用配置" },
        { text: "主题配置", link: "/vitePress/主题配置" },
        { text: "Frontmatter配置", link: "/vitePress/Frontmatter配置" },
      ],
    },
  ];
}
