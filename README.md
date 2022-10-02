# react-crx-mv3

基于 Create-React-APP+Antd 的 Chrome Extension Manifest V3 工程脚手架。

本项目架构实现了以下功能：

-   基于 Create-React-App 5.0.0 搭建
-   基于 Chrome Extension Manifest V3 规范
-   集成 Sass/Scss/Less/Stylus
-   集成 Ant Design
-   集成 mock.js 模拟请求
-   集成 http-proxy-middleware 反向代理
-   集成 react-router-dom v6
-   解决 Ant Design 全局样式污染问题
-   实现 Ant Design 按需加载
-   将 popup、content、background 目录互相独立，便于团队协作开发维护
-   按照 Chrome Extension 最终生成目录要求配置 webpack
-   封装 fetch，满足 popup、content script、background script 跨域请求
-   设置.env.development 环境变量，便于在开发环境下禁止委托 background script 发起请求
-   实现了完整的 Chrome Extension MV3 项目 Demo。

## 开发调试

执行：

```
yarn start
```

即可在开发环境预览调试 popup 页面

如果需要在开发环境预览调试 content script，

请修改 src/popup/index.js，引入 content script：

```
    import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
    import Login from '@/popup/pages/login'
    import Home from '@/popup/pages/home'
    import './popup.styl'
    // 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
M   import '@/content'
```

## build 项目

执行：

```
yarn build
```

即可生成最终 Chrome Extension 文件。

## 精简最终 build 文件

build 生成的最终文件，对于插件来说，有很多是不必要的。

可删除以下文件：

```
    ├─ /images
    ├─ /static
    |  ├─ /css
    |  |  ├─ content.css
    |  |  └─ main.css
    |  └─ /js
    |     ├─ background.js
    |     ├─ content.js
-   |     ├─ content.js.LICENSE.txt
    |     ├─ main.js
-   |     └─ main.js.LICENSE.txt
-   ├─ asset-manifest.json
    ├─ favicon.ico
    ├─ index.html
    ├─ insert.js
    └─ manifest.json
```
