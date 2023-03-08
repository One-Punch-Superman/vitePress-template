# Extending the Default Theme

VitePress' default theme is optimized for documentation, and can be customized. Consult the [Default Theme Config Overview](/reference/default-theme-config) for a comprehensive list of options.

However, there are a number of cases where configuration alone won't be enough. For example:

1. You need to tweak the CSS styling;
2. You need to modify the Vue app instance, for example to register global components;
3. You need to inject custom content into the theme via layout slots.

These advanced customizations will require using a custom theme that "extends" the default theme.

:::tip
Before proceeding, make sure to first read [Using a Custom Theme](./custom-theme) to understand how custom themes work.
:::

## Customizing CSS

The default theme CSS is customizable by overriding root level CSS variables:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

```css
/* .vitepress/theme/custom.css */
:root {
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
}
```

See [default theme CSS variables](https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css) that can be overridden.

## Registering Global Components

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    // register your custom global components
    ctx.app.component('MyGlobalComponent' /* ... */)
  }
}
```

Since we are using Vite, you can also leverage Vite's [glob import feature](https://vitejs.dev/guide/features.html#glob-import) to auto register a directory of components.

## Layout Slots

The default theme's `<Layout/>` component has a few slots that can be used to inject content at certain locations of the page. Here's an example of injecting a component into the before outline:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout: MyLayout
}
```

```vue
<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      My custom sidebar top content
    </template>
  </Layout>
</template>
```

Or you could use render function as well.

```js
// .vitepress/theme/index.js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import MyComponent from './MyComponent.vue'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => h(MyComponent)
    })
  }
}
```

Full list of slots available in the default theme layout:

- When `layout: 'doc'` (default) is enabled via frontmatter:
  - `doc-footer-before`
  - `doc-before`
  - `doc-after`
  - `sidebar-nav-before`
  - `sidebar-nav-after`
  - `aside-top`
  - `aside-bottom`
  - `aside-outline-before`
  - `aside-outline-after`
  - `aside-ads-before`
  - `aside-ads-after`
- When `layout: 'home'` is enabled via frontmatter:
  - `home-hero-before`
  - `home-hero-info`
  - `home-hero-image`
  - `home-hero-after`
  - `home-features-before`
  - `home-features-after`
- Always:
  - `layout-top`
  - `layout-bottom`
  - `nav-bar-title-before`
  - `nav-bar-title-after`
  - `nav-bar-content-before`
  - `nav-bar-content-after`
  - `nav-screen-content-before`
  - `nav-screen-content-after`

