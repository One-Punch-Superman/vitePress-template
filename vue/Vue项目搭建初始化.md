# Vue 项目搭建初始化

## 介绍

使用 vite+vue3+vueRouter+pinia+ts+elementPlus 搭建项目

## vite 初始化项目

```bash
yarn create vite my-app --template vue-ts
```

## 路由 vue-router

```bash
yarn add vue-router
```

在 src 下新建 router/index.ts

```js
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

export default router;
```

修改入口文件 mian.ts

```js
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.mount("#app");
```

## 状态管理 pinia

```bash
yarn add pinia pinia-plugin-persist
```

在 src 下新建 store/index.ts

```js
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const store = createPinia();
store.use(piniaPluginPersist);

export default store;
```

修改入口文件 mian.ts

```js
import { createApp } from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
```

## 组件库 element-plus

```bash
yarn add element-plus normalize.css
```

修改入口文件 mian.ts

```js
import { createApp } from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.mount("#app");
```

修改根组件 App.vue

```js
<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
</script>
```

## css 预处理器 scss

```bash
yarn add sass -D
```

在 src/assets 下新建 style/index.scss,配置全局样式

```css
@import "normalize.css";

body {
  box-sizing: border-box;
}
```

## 封装请求 axios

```bash
yarn add axios nprogress
```

在 src 下新建 utils/request.ts,封装请求

```js
import axios, { AxiosRequestConfig } from "axios";
import NProgress from "nprogress";

// 设置请求头和请求路径
axios.defaults.baseURL = "/api";
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// 请求拦截
axios.interceptors.request.use(
  (config): AxiosRequestConfig<any> => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      //@ts-ignore
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return error;
  }
);

// 响应拦截
axios.interceptors.response.use((res) => {
  if (res.data.code === 111) {
    sessionStorage.setItem("token", "");
    // token过期操作
  }
  return res;
});

export function get(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    NProgress.start();
    axios
      .get(url, { params })
      .then((res) => {
        NProgress.done();
        resolve(res.data);
      })
      .catch((err) => {
        NProgress.done();
        reject(err.data);
      });
  });
}

export function post(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    NProgress.start();
    axios
      .post(url, JSON.stringify(params))
      .then((res) => {
        NProgress.done();
        resolve(res.data);
      })
      .catch((err) => {
        NProgress.done();
        reject(err.data);
      });
  });
}

export function upload(url: string, file: any) {
  return new Promise((resolve, reject) => {
    NProgress.start();
    axios
      .post(url, file, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        NProgress.done();
        resolve(res.data);
      })
      .catch((err) => {
        NProgress.done();
        reject(err.data);
      });
  });
}

export function download(url: string) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  iframe.onload = function () {
    document.body.removeChild(iframe);
  };
  document.body.appendChild(iframe);
}
```

## 约束代码风格

### eslint 支持

```bash
npm install -D eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

这四个依赖的作用分别是：

eslint: EsLint 的核心代码;

eslint-plugin-vue：为 Vue 使用 Eslint 的插件;

@typescript-eslint/parser：ESLint 的解析器，用于解析 typescript，从而检查和规范 Typescript 代码;

@typescript-eslint/eslint-plugin：这是一个 ESLint 插件，包含了各类定义好的检测 Typescript 代码的规则。

配置 eslint 校验规则，项目根目录下新建.eslintrc.cjs

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: "vue-eslint-parser",
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    // eslint-config-prettier 的缩写
    "prettier",
    "./.eslintrc-auto-import.json",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  // eslint-plugin-vue @typescript-eslint/eslint-plugin eslint-plugin-prettier的缩写
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-var": "error",
    "prettier/prettier": "error",
    // 禁止出现console
    "no-console": "off",
    // 禁用debugger
    "no-debugger": "off",
    // 关闭组件命名规则
    "vue/multi-word-component-names": "off",
    // 禁止出现重复的 case 标签
    "no-duplicate-case": "warn",
    // 禁止出现空语句块
    "no-empty": "warn",
    // 禁止不必要的括号
    "no-extra-parens": "off",
    // 禁止对 function 声明重新赋值
    "no-func-assign": "warn",
    // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
    "no-unreachable": "warn",
    // 强制所有控制语句使用一致的括号风格
    curly: "warn",
    // 要求 switch 语句中有 default 分支
    "default-case": "warn",
    // 强制尽可能地使用点号
    "dot-notation": "warn",
    // 要求使用 === 和 !==
    eqeqeq: "warn",
    // 禁止 if 语句中 return 语句之后有 else 块
    "no-else-return": "warn",
    // 禁止出现空函数
    "no-empty-function": "warn",
    // 禁用不必要的嵌套块
    "no-lone-blocks": "warn",
    // 禁止使用多个空格
    "no-multi-spaces": "warn",
    // 禁止多次声明同一变量
    "no-redeclare": "warn",
    // 禁止在 return 语句中使用赋值语句
    "no-return-assign": "warn",
    // 禁用不必要的 return await
    "no-return-await": "warn",
    // 禁止自我赋值
    "no-self-assign": "warn",
    // 禁止自身比较
    "no-self-compare": "warn",
    // 禁止不必要的 catch 子句
    "no-useless-catch": "warn",
    // 禁止多余的 return 语句
    "no-useless-return": "warn",
    // 禁止变量声明与外层作用域的变量同名
    "no-shadow": "off",
    // 允许delete变量
    "no-delete-var": "off",
    // 强制数组方括号中使用一致的空格
    "array-bracket-spacing": "warn",
    // 强制在代码块中使用一致的大括号风格
    "brace-style": "warn",
    // 强制使用骆驼拼写法命名约定
    camelcase: "warn",
    // 强制使用一致的缩进
    indent: "off",
    // 强制在 JSX 属性中一致地使用双引号或单引号
    // 'jsx-quotes': 'warn',
    // 强制可嵌套的块的最大深度4
    "max-depth": "warn",
    // 强制最大行数 300
    // "max-lines": ["warn", { "max": 1200 }],
    // 强制函数最大代码行数 50
    // 'max-lines-per-function': ['warn', { max: 70 }],
    // 强制函数块最多允许的的语句数量20
    "max-statements": ["warn", 100],
    // 强制回调函数最大嵌套深度
    "max-nested-callbacks": ["warn", 3],
    // 强制函数定义中最多允许的参数数量
    "max-params": ["warn", 3],
    // 强制每一行中所允许的最大语句数量
    "max-statements-per-line": ["warn", { max: 1 }],
    // 要求方法链中每个调用都有一个换行符
    "newline-per-chained-call": ["warn", { ignoreChainWithDepth: 3 }],
    // 禁止 if 作为唯一的语句出现在 else 语句中
    "no-lonely-if": "warn",
    // 禁止空格和 tab 的混合缩进
    "no-mixed-spaces-and-tabs": "warn",
    // 禁止出现多行空行
    "no-multiple-empty-lines": "warn",
    // 禁止出现;
    semi: ["warn"],
    // 强制在块之前使用一致的空格
    "space-before-blocks": "warn",
    // 强制在 function的左括号之前使用一致的空格
    // 'space-before-function-paren': ['warn', 'never'],
    // 强制在圆括号内使用一致的空格
    "space-in-parens": "warn",
    // 要求操作符周围有空格
    "space-infix-ops": "warn",
    // 强制在一元操作符前后使用一致的空格
    "space-unary-ops": "warn",
    // 强制在注释中 // 或 /* 使用一致的空格
    // "spaced-comment": "warn",
    // 强制在 switch 的冒号左右有空格
    "switch-colon-spacing": "warn",
    // 强制箭头函数的箭头前后使用一致的空格
    "arrow-spacing": "warn",
    "no-var": "warn",
    "prefer-const": "warn",
    "prefer-rest-params": "warn",
    "no-useless-escape": "warn",
    "no-irregular-whitespace": "warn",
    "no-prototype-builtins": "warn",
    "no-fallthrough": "warn",
    "no-extra-boolean-cast": "warn",
    "no-case-declarations": "warn",
    "no-async-promise-executor": "warn",
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
};
```

配置 eslint 忽略检查项，项目根目录下新建.eslintignore

```bash
node_modules
dist
```

### prettier 支持

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

这三个依赖分别是：

prettier：prettier 插件的核心代码;

eslint-config-prettier：解决 ESLint 中的样式规范和 prettier 中样式规范的冲突，以 prettier 的样式规范为准，使 ESLint 中的样式规范自动失效;

eslint-plugin-prettier：将 prettier 作为 ESLint 规范来使用。

配置 prettier 校验规则，项目根目录下新建.prettierrc.cjs

```js
module.exports = {
  tabWidth: 2,
  printWidth: 120, // 最大行数
  singleQuote: true, // 使用单引号
  semi: true, // 句尾使用分号
  trailingComma: "none", // 对象末尾不使用逗号
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
      },
    },
  ],
  arrowParens: "always",
};
```

配置 prettier 忽略检查项，项目根目录下新建.prettierignore

```bash
node_modules
dist
```

### stylelint 支持

```bash
npm install -D stylelint stylelint-config-standard stylelint-config-html stylelint-config-recommended-scss stylelint-config-recommended-vue stylelint-config-recess-order postcss postcss-html postcss-scss
```

依赖说明

stylelint: stylelint 核心库;

stylelint-config-standard: Stylelint 标准共享配置，详细可查看官方文档;

stylelint-config-recommended-scss: scss 的推荐可共享配置规则，详细可查看官方文档;

stylelint-config-recommended-vue: vue 的样式配置;

stylelint-config-html: 配置 vue 中 template 样式格式化;

stylelint-config-recess-order: 指定样式书写的顺序，在.stylelintrc.js 中 order/properties-order 指定顺序。

postcss: 转换 css 代码工具;

postcss-html: 解析 HTML (类似 HTML) 的 PostCSS 语法;

postcss-scss: PostCSS 的 SCSS 解析器;

配置 stylelint 校验规则，项目根目录下新建.stylelintrc.cjs

```js
// @see: https://stylelint.io

module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-html/vue",
    "stylelint-config-recess-order",
  ],
  overrides: [
    {
      files: ["**/*.{scss,css}"],
      customSyntax: "postcss-scss",
    },
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html",
    },
  ],
  /**
   * null  => 关闭该规则
   */
  rules: {
    indentation: null, // 指定缩进空格
    "no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    "function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    "string-quotes": "double", // 指定字符串使用单引号或双引号
    "unit-case": null, // 指定单位的大小写 "lower(全小写)"|"upper(全大写)"
    "color-hex-case": "lower", // 指定 16 进制颜色的大小写 "lower(全小写)"|"upper(全大写)"
    "color-hex-length": "short", // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
    "rule-empty-line-before": "never", // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行。)"
    "font-family-no-missing-generic-family-keyword": null, // 禁止在字体族名称列表中缺少通用字体族关键字
    "block-opening-brace-space-before": "always", // 要求在块的开大括号之前必须有一个空格或不能有空白符 "always(大括号前必须始终有一个空格)"|"never(左大括号之前绝不能有空格)"|"always-single-line(在单行块中的左大括号之前必须始终有一个空格)"|"never-single-line(在单行块中的左大括号之前绝不能有空格)"|"always-multi-line(在多行块中，左大括号之前必须始终有一个空格)"|"never-multi-line(多行块中的左大括号之前绝不能有空格)"
    "property-no-unknown": null, // 禁止未知的属性(true 为不允许)
    "no-empty-source": null, // 禁止空源码
    "declaration-block-trailing-semicolon": null, // 要求或不允许在声明块中使用尾随分号 string："always(必须始终有一个尾随分号)"|"never(不得有尾随分号)"
    "selector-class-pattern": null, // 强制选择器类名的格式
    "scss/at-import-partial-extension": null, // 解决不能引入scss文件
    "value-no-vendor-prefix": null, // 关闭 vendor-prefix(为了解决多行省略 -webkit-box)
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "v-deep", "deep"],
      },
    ],
    // Specify the alphabetical order of the attributes in the declaration block
    "order/properties-order": [
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "display",
      "flex-direction",
      "justify-content",
      "align-items",
      "float",
      "width",
      "height",
      "max-width",
      "max-height",
      "min-width",
      "min-height",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "margin-collapse",
      "margin-top-collapse",
      "margin-right-collapse",
      "margin-bottom-collapse",
      "margin-left-collapse",
      "overflow",
      "overflow-x",
      "overflow-y",
      "clip",
      "clear",
      "font",
      "font-family",
      "font-size",
      "font-smoothing",
      "osx-font-smoothing",
      "font-style",
      "font-weight",
      "hyphens",
      "src",
      "line-height",
      "letter-spacing",
      "word-spacing",
      "color",
      "text-align",
      "text-decoration",
      "text-indent",
      "text-overflow",
      "text-rendering",
      "text-size-adjust",
      "text-shadow",
      "text-transform",
      "word-break",
      "word-wrap",
      "white-space",
      "vertical-align",
      "list-style",
      "list-style-type",
      "list-style-position",
      "list-style-image",
      "pointer-events",
      "cursor",
      "background",
      "background-attachment",
      "background-color",
      "background-image",
      "background-position",
      "background-repeat",
      "background-size",
      "border",
      "border-collapse",
      "border-top",
      "border-right",
      "border-bottom",
      "border-left",
      "border-color",
      "border-image",
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "border-spacing",
      "border-style",
      "border-top-style",
      "border-right-style",
      "border-bottom-style",
      "border-left-style",
      "border-width",
      "border-top-width",
      "border-right-width",
      "border-bottom-width",
      "border-left-width",
      "border-radius",
      "border-top-right-radius",
      "border-bottom-right-radius",
      "border-bottom-left-radius",
      "border-top-left-radius",
      "border-radius-topright",
      "border-radius-bottomright",
      "border-radius-bottomleft",
      "border-radius-topleft",
      "content",
      "quotes",
      "outline",
      "outline-offset",
      "opacity",
      "filter",
      "visibility",
      "size",
      "zoom",
      "transform",
      "box-align",
      "box-flex",
      "box-orient",
      "box-pack",
      "box-shadow",
      "box-sizing",
      "table-layout",
      "animation",
      "animation-delay",
      "animation-duration",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-timing-function",
      "animation-fill-mode",
      "transition",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "background-clip",
      "backface-visibility",
      "resize",
      "appearance",
      "user-select",
      "interpolation-mode",
      "direction",
      "marks",
      "page",
      "set-link-source",
      "unicode-bidi",
      "speak",
    ],
  },
};
```

配置 stylelint 忽略检查项，项目根目录下新建.stylelintignore

```bash
node_modules
dist
```

### editorconfig 支持

配置 editorconfig 校验规则，项目根目录下新建.editorconfig

```bash
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

## unplugin-auto-import 配置

```bash
yarn add unplugin-auto-import -D
```

修改 .eslintrc.js 配置文件

```js
module.exports = {
  extends: [
    ...,
    './.eslintrc-auto-import.json'
  ]
};
```

修改 tsconfig.json 配置文件

```json
{
  "compilerOptions": {
    ...,
    // 配置路径别名
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "auto-imports.d.ts"]
}
```

## package.json 配置

```bash
{
  "script": {
    "lint": "eslint --ext .ts,.tsx,.vue,.js,.jsx --fix",
    "style": "stylelint src .css,.scss,.vue --fix",
    "prettier": "prettier --write src/"
  }
}
```

## vite.config.ts 配置

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import path from "path";

const PROXY = {
  target: "https://www.huawei.com/",
  secure: false,
  ws: true,
  changeOrigin: true,
};

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    open: true,
    proxy: {
      "/rest": PROXY,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
});
```

## settings.json 配置

项目根目录下新建.vscode/settings.json

```json
{
  "workbench.startupEditor": "none",
  "editor.fontSize": 16,
  "workbench.colorTheme": "Visual Studio Light",
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "editor.fontLigatures": false,
  // 保存自动格式化
  "editor.formatOnSave": true,
  // 开启自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  },
  "eslint.validate": ["javascript", "vue", "html"],
  "stylelint.validate": ["css", "scss", "vue", "html"],
  // 默认格式化工具选择prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
