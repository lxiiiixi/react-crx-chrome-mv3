> **相关文档**
>
> - CRA: https://create-react-app.dev/docs/getting-started
> - Antd: https://ant.design/
> - Chrome: https://developer.chrome.com/docs/extensions/mv3/
> - Gitbook参考资料: https://doc.yilijishu.info/chrome/

## 1 初始化项目

#### 1.1 使用create-react-app创建一个项目

```sh
$ npx create-react-app cra-chrome-v3
```

创建成功后按照常规流程进入并启动项目

#### 1.2 精简项目

删除不需要的文件只保存需要用到的react核心文件

保存核心文件如下:

<img src="https://cdn.jsdelivr.net/gh/lxiiiixi/Image-Hosting/Markdown/image-20221113171704067.png" alt="image-20221113171704067" style="zoom:50%;" />

## 2. Chrome Extension 基础

> Manifest V3 从 Chrome [88](https://chromiumdash.appspot.com/schedule) 开始可用，Chrome Web Store 于 2021 年 1 月开始接受 MV3 扩展。
>
> 使用 MV3 的扩展有许多新特性和功能更改：
>
> - Service workers替换background pages。
> - 现在使用新的 [declarativeNetRequest](https://doc.yilijishu.info/chrome/declarativeNetRequest.html) API 处理网络请求修改。
> - 不再允许远程托管代码；扩展只能执行包含在其包中的 JavaScript。
> - `Promise` 支持已添加到许多方法中，但仍支持回调作为替代方法。 （我们最终将支持对所有适当方法的承诺。）
> - MV3 中还引入了许多其他相对较小的功能更改。
>
> V3版本具有更好的隐私、安全和性能, 还能使用更多新的Web技术

#### 2.1 Manifest V3概述

1. Service Workers 取代 background pages

   在 chrome://extension/ 中可以看到MV3插件和MV2插件地步分别显示的是Service Worker和背景页

2. 网络请求调整

   新增 declarativeNetRequest API, 允许插件修改以及阻断网络请求

3. 远程资源访问限制

   禁止访问外部的Js以及Wasm文件, 图片、音视频文件不受影响

4. Promise使用

#### 2.2 Chrome Extension的组成

主要有以下几个核心组成部分

- manifast.json —— 插件配置文件
  - 必须放在插件项目根目录, 里面包含了插件的各种配置信息, 其中也包括了popup、content script、background script等路径
- popup —— 插件图标目录页面中执行的js
  - 作为一个独立的弹出页面, 有自己的html、css、js, 可以按照常规项目来开发
- content script —— 插入到目标页面中执行的js
  - content script是注入到目标页面中执行的js脚本, 可以获取目标页面的Dom并进行修改, 但是content script的js与目标页面是相互隔离的, 也就是说content script 与目标页面的js不会出现相互污染的问题, 同时也不能调用对方的方法 (但是这里说的只是js作用域的隔离, 通过content script向目标页面加入的Dom是可以应用于目标页面的css从而造成css相互污染的)
- background script —— 在chrome后台Service workers中运行的程序
  - background script常驻于浏览器后台Service Workers运行, 没有实际的页面; 一般把全局的、需要一直运行的代码放在这里; 并且background script的权限非常高, 处理可以调用几乎所有的Chrome Extension API以外, 还可以发起跨域请求

#### 2.3 规划build生成的目录结构

我们需要按照chrome extension官方以及manifest.json的要求按照以下结构build生成最终的目录

<img src="https://cdn.jsdelivr.net/gh/lxiiiixi/Image-Hosting/Markdown/image-20221113173908209.png" alt="image-20221113173908209" style="zoom:50%;" />

#### 2.4 manifest.json的配置

修改 public/manifest.josn

(下面的注释不能保留)

> 更多配置参考: https://developer.chrome.com/docs/extensions/mv3/manifest/

```json
{
  "name": "Chrome插件V3",
  "version": "1.0",
  "description": "React开发chrome插件V3 Demo。",
  "manifest_version": 3, // 版本号(表示V3)
  "background": { // background script 配置(根目录为最终build生成的插件包目录)
    "service_worker": "static/js/background.js"
  },
  "content_scripts": [ // content script 配置
    {
      "matches": [ // 应用于哪些页面地址(可以使用正则,<all_urls>表示匹配所有地址)
        "<all_urls>"
      ],
      "css": [ // 注入到目标页面的css(不要污染目标页面的样式)
        "static/css/content.css"
      ],
      "js": [ // 注入到目标页面的js,这个js是在沙盒中运行的,与目标页面是隔离的,没有污染问题
        "static/js/content.js"
      ],
      "run_at": "document_end" // 代码注入的时机, 可选document_start、document_end、document_idle(默认)
    }
  ],
  "permissions": [ // 申请API权限
    "storage",
    "declarativeContent"
  ],
  // 插件设计外部请求的地址
  "host_permissions": [],
  // 如果像目标页面注入图片或js需要在这里授权插件本地资源
  "web_accessible_resources": [
    {
      "resources": [
        "/images/app.png"
      ],
      "matches": [
        "<all_urls>"
      ]
    }
  ],
  // popup页面配置
  "action": {
    // popup页面的路径(根目录为最终build生成的插件包目录)
    "default_popup": "index.html",
    // 浏览器插件按钮的图标
    "default_icon": {
      "16": "/images/app.png",
      "32": "/images/app.png",
      "48": "/images/app.png",
      "128": "/images/app.png"
    },
    // 浏览器插件hover显示的文字
    "default_title": "React CRX MV3"
  },
  // 插件图标
  "icons": {
    "16": "/images/app.png",
    "32": "/images/app.png",
    "48": "/images/app.png",
    "128": "/images/app.png"
  }
}
```

> - permission权限配置参考: https://developer.chrome.com/docs/extensions/mv3/permission_warnings/

## 3. 开发结构设计及build配置

#### 3.1 开发结构设计

后续所有操作都是基于此目录结构

<img src="https://cdn.jsdelivr.net/gh/lxiiiixi/Image-Hosting/Markdown/image-20221113180111237.png" alt="image-20221113180111237" style="zoom:50%;" />

> **说明:**
>
> - 本目录结构将backgound、content、popup分别建立独立的目录并且设置Api、common等公共目录
> - 由于content script是在目标页面上执行, 并不是独立的页面, 因此不能使用router, 所以无需page目录
> - popup是独立的页面, 可以完全按照常规的react项目设定相应的目录

#### 3.2 配置wabpack

##### 3.2.1 暴露webpack

执行eject 将webpack暴露出来 才能对webpack进行修改

```sh
$ npm run eject
```

运行之后会多出很多文件

#### 3.2.1 安装Sass

eject后虽然package.json以及webpack.config.js中有saaa相关代码, 但是我们还需要安装node-sass

```sh
$ npm i node-sass --dev
```

#### 3.2.2 设置路径别名

为了避免使用相对路径的麻烦, 可以设置路径别名

修改config/webpack.config.js中:

```js
alias: {
  // Support React Native Web
  // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
  'react-native': 'react-native-web',
    // Allows for better profiling with ReactDevTools
    ...(isEnvProductionProfile && {
    'react-dom$': 'react-dom/profiling',
    'scheduler/tracing': 'scheduler/tracing-profiling',
  }),
    ...(modules.webpackAliases || {}),
    '@': path.join(__dirname, '..', 'src'), // ++++++++++++++
},
```

这样在js代码开头的import路径中, 可以直接使用@表示src根目录,可以不用通过相对路径去查找文件了

```js
import "@/app.js" // 表示src/app.js文件
```

#### 3.2.3 禁止build项目生成map文件

修改config/webpack.config.js, 将shouldUseSourceMap改为false

```js
// const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldUseSourceMap = false
```

#### 3.2.4 设置多入口

这一步是实现React框架Chrome插件的关键

为了让我们几个核心的文件打包后按照manifest.json中设置的文件目录, 分别编译对应的文件, 需要设置多入口

对config/webpack.config.js中的入口entry项进行以下修改

```js
// entry: paths.appIndexJs,
entry: {
  main: isEnvDevelopment && !shouldUseReactRefresh
    ? [webpackDevClientEntry, paths.appIndexJs] : paths.appIndexJs,
    content: './src/content/index.js',
      background: './src/background/index.js'
},
  // 就是将原来的entry拆成多个对应的入口
```

##### 3.2.5 固定build生成的文件名

Manifest.json中配置的路径和文件名是固定的, 所以必须保证每次build生成的文件名是不变的

1. 去掉文件hash值, 删除webpack配置代码中的[contenthash:8] (4处)

   ```js
   filename: isEnvProduction
    - ? 'static/js/[name].[contenthash:8].js' 
   // 这里删除掉改为
    + ? 'static/js/[name].js'
   : isEnvDevelopment && 'static/js/bundle.js',
   ```

2. 由于是多入口, 所以需要将static/js/bundle.js修改为static/js/[name].bundle/.js

   ```js
         filename: isEnvProduction
           // ? 'static/js/[name].[contenthash:8].js'
           ? 'static/js/[name].js'
           // : isEnvDevelopment && 'static/js/bundle.js',
           : isEnvDevelopment && 'static/js/[name].bundle.js',
   ```

3. 将runtimeChunk设置为false(否则build之后会生成runtime-background.js,runtime-content.js,runtime-main.js)

   ```js
    optimization:{
      ...... 
       runtimeChunk: false
    }
   ```

##### 3.2.6 设置popup只引入自己的index.js

需要在webpack.config.js做如下修改, 设置index.html只引入main.js

```js
plugins: [
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        chunks:['main'], // ++++++++++++
        template: paths.appHtml,
      },
```

## 4. 引入Antd

#### 4.1 安装

```sh
$ npm i antd
```

#### 4.2 实现按需加载

1. 安装babel

   ```js
   npm i babel-plugin-import --dev
   ```

2. 修改package.json

   ```json
   "babel": {
     "presets": [
       "react-app"
     ],
     "plugins": [  // +++++++++++++
       [
         "import",
         {
           "libraryName": "antd",
           "style": "css"
         }
       ]
     ]
   }
   ```

3. 在App.json中验证引入成功

   ```jsx
   import { Button } from "antd"
   
   function App() {
     return (
       <div className="App">demo <Button type="primary">demo</Button></div>
     );
   }
   
   export default App;
   ```

## 5. popup开发

1. 插入一张图片: public/images/app.png (插件的展示图标)

2. 由于目前src/content/content.css还没有被引用, build并不会生成content.css, 从而导致插件加载失败, 我们现在暂时先把manifest.json中content_script中css配置删掉,等到开发content部分的时候再加上

   ```json
     "content_scripts": [
       {
         "matches": [
           "<all_urls>"
         ],
         "css": [
           "static/css/content.css"
         ],
         "js": [
           "static/js/content.js"
         ],
         "run_at": "document_end"
       }
     ],
   ```

#### 5.1 安装react-router-dom

```sh
$ npm i react-router-dom
```

#### 5.2 页面构建

1. 删除src/App.js, 在src/index.js直接引入popup入口文件

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'
import Popup from '@/popup'
// 引入自定义全局公用样式
import '@/common/stylus/frame.styl'

const antdConfig = {
  locale: zhCN,
}

ReactDOM.render(
  <ConfigProvider {...antdConfig}>
    <Popup />
  </ConfigProvider>,
  document.getElementById('root')
)
```

2. popup路由页面代码  在src/popup/index.js:

```jsx
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from '@/popup/pages/login'
import Home from '@/popup/pages/home'
import './popup.styl' // 作为popup所有页面的全局样式
// 在popup页面调试content script，仅用于开发环境，build前记得要注释掉。
import '@/content'

function Popup() {
    return (
        <HashRouter>
            <Routes>
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </HashRouter>
    )
}

export default Popup
```

3. 需要定义一下popup的全局样式 点击插件按钮弹出的页面尺寸是根据body的宽高来决定的

```scss
body {
    position: relative;
    width: 380px;
    height: 510px;
}
```

4. 分别构建简单的home和login两个页面的代码和基本样式结构 实现基本的跳转等
5. npm run start 可以查看基本的效果
6. npm run build 打包后运行插件测试基本效果

> build完成后打开chrome浏览器, 地址栏输入: chrome://extensions/
>
> 进入扩展程序界面
>
> 1. 打开开发者模式
> 2. 点击:加载已解压的扩展程序
> 3. 选择项目工程中刚生成的build目录

## 7. background script开发

#### 7.1 设置允许运行popup的页面规则

通过规则的设定, 可以让全部页面或者指定页面运行插件, 进行以下设置:

(不符合规则的页面插件会被禁用)

```JS
/*global chrome*/
// manifest.json的Permissions配置需添加 declarativeContent 权限
chrome.runtime.onInstalled.addListener(function () {
    // 默认先禁止Page Action。如果不加这一句，则无法生效下面的规则
    chrome.action.disable()
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // 设置规则
        let rule = {
            // 运行插件运行的页面URL规则
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        // 适配所有域名以“www.”开头的网页
                        hostPrefix: 'www.'
                        // 适配所有域名以“.baidu.com”结尾的网页
                        // hostSuffix: '.baidu.com',
                        // 适配域名为“www.baidu.com”的网页
                        // hostEquals: 'www.baidu.com',
                        // 适配https协议的网页
                        // schemes: ['https'],
                    },
                }),
            ],
            actions: [
                // ShowPageAction已被废弃，改用ShowAction。为了兼顾旧版，做了兼容适配
                chrome.declarativeContent.ShowAction
                    ? new chrome.declarativeContent.ShowAction()
                    : new chrome.declarativeContent.ShowPageAction(),
            ],
        }
        // 整合所有规则
        const rules = [rule]
        // 执行规则
        chrome.declarativeContent.onPageChanged.addRules(rules)
    })
})
```

> 从MV3开始, background script 运行在 Server Worker 上,并不是基于DOM了, 所以没有window这个变量了

## 8. content script开发

先把manifest.json中content_scripts中对css的部分加回来

#### 8.1 实现像目标页面注入一个悬浮球

1. 在src/content/images下面放一个图片
2. src/content/index.js中写入组件和src/content/content.scss中写入相关样式 (由于插入的DOM和Css会与目标页面的css相互污染, 建议吧最外层的标签定义一个特殊的className, 减少污染的可能性)
3. 重新打包刷新插件, 可以看到页面中出现了写入的悬浮球

#### 8.2 在content script中使用Antd组件

src/content/components/popModal/index.js: 加入Modal

src/content/index.js: 引入该组件, 实现点击悬浮按钮出现弹窗

```js
import { Button, Input, Modal, Select } from 'antd'
```

如果按照这个方式直接从Antd中引入的话, 会发现content中的Modal组件虽然可以正常显示, 但是页面中的部分样式被污染改变

<img src="https://cdn.jsdelivr.net/gh/lxiiiixi/Image-Hosting/Markdown/image-20221115121727125.png" alt="image-20221115121727125" style="zoom:50%;" />

#### 8.3 解决Antd样式对页面的污染问题

- 造成这个问题的原因: Antd的reset样式是直接针对标签, 并没有限定在某个外层样式里, 因此造成了污染, 同时Antd的样式也有可能被目标页面的样式所污染

- 解决方法:

  - (1) 单独引用Antd组件的js和css, 这样就可以避免加载Antd的全局reset样式

    content目录下对Antd组件的使用都改用单独引用的方式

  - (2) 把Antd的全局reset样式Copy一份, 给每个样式前面加上父级样式来降级为非全局样式, 然后再content script全局引入这个样式文件

    在content/index.js中引入antd-diy.css

  - (3) content开发的组件最外层加上上面所说的父级样式

    在content/index.js中给最外层组件的classname加上'CRX-antd-diy'

## 10. 在开发环境调试 content script

我们执行pupop页面时用npm run start可以直接调试页面的效果, 但是对于content script得调试都需要修改代码后build再重新加载; 因为content script是可以插入到任何页面的, 那么同样也可以插入到pupop页面, 执行npm run start就可以直接在pupop页面调试content script了

具体操作如下:

1. 打开 chrome://extension/ , 暂时禁用本插件(避免与开发环境的content script重复执行)
2. 在 scr/popup/index.js 中引入content script (但是在下次build之前记得注释掉)
3. 用start运行程序

## 11. API请求

在 Chrome Extension 中, popup页面以及 backgrund script 是可以直接跨域请求的, 而content script运行在目标页面, 需要委托 backgrund script 发起跨域请求

#### 11.1 background pages不支持XMLHttpRequest(axios)

按照官方说明, 在MV3中由于Service Workers的机制, background pages 中不支持XMLHttpRequest, 建议使用原生 fetch(), 由于axios使用的是XMLHttpRequest, 因此不能使用axios进行API请求

#### 11.2 设置开发环境的反向代理请求

借助 http-proxy-middleware

```sh
 npm i http-proxy-middleware
```

在src目录下新建 setupProxy.js

```js
/**
 * 反向代理配置
 */
 const { createProxyMiddleware } = require('http-proxy-middleware');
 module.exports = function (app) {
     app.use(
         // 开发环境API路径匹配规则
         '^/api',
         createProxyMiddleware({
             // 要代理的真实接口API域名
             target: 'http://localhost',
             changeOrigin: true
         })
     )
 }
```

#### 11.3 封装API及fetch业务逻辑

见 src/api/index.js 中的代码

#### 11.4 委托 background script 完成API请求

修改 src/background/index.js, 完成消息的接收和处理

```JS
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 接受来自content-script的消息，requset里不允许传递function和file类型的参数
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const { contentRequest } = request
        // 接收来自content的api请求
        if (contentRequest === 'apiRequest') {
            let { config } = request
            // API请求成功的回调
            config.success = (data) => {
                data.result = 'succ'
                sendResponse(data)
            }
            // API请求失败的回调
            config.fail = (msg) => {
                sendResponse({
                    result: 'fail',
                    msg
                })
            }
            // 发起请求
            apiRequest(config)
        }
    })
    return true
})
```

#### 11.5 实现popup页面的API请求

在 src/popup/pages/login/index.js 中:

```js
// 引入API
import { apiReqs } from '@/api'

// 登录方法
const login = () => {
  console.log(password, account);
  apiReqs.signIn({
    // 如果上传文件，则设置formData为true，这里暂时不用。
    // formData: true,
    data: {
      account,
      password,
    },
    success: (res) => {
      console.log(res)
      navigate('/home')
    },
    fail: (res) => {
      alert(res)
    },
  })
}
```

#### 11.6 实现 content script 的API请求

在 src/content/components/PopModal/index.js 中:

```js
// 引入
import { apiReqs } from '@/api'

// 调用提交方法
    const submit = () => {
        console.log(text, option);
        apiReqs.submitByBackground({
            data: {
                text,
                option,
            },
            success: (res) => {
                console.log(res)
            },
            fail: (res) => {
                alert(res)
            },
        })
    }
    
    
// src/api/index.js中: 增加对应的接口函数
        // 委托background提交数据
    submitByBackground: (config) => {
        config.background = true
        config.url = API_DOMAIN + 'submit'
        config.method = 'post'
        apiFetch(config)
    },
```

> **总结**
>
> - 在开发环境中, pupop、content script 可以直接发起API请求
> - build环境中, popup可以直接发起跨域请求, content script 需要委托background script发起跨域请求
> - background script 基于 Service Workers, 只能通过原生 fetch()请求, 不能使用axios, 并且没有DOM, 也不存在window变量
> - content script 通过 chrome.runtime.sendMessage方法向 background script 发送消息, background script 接收消息后进行处理, 并通过 sendResponse方法返回给 content script

## 12. 实现自动build

```sh
npm i npm-watch
```

在 package.json 中加入

```json
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js",
    "watch": "npm-watch"  // ++++++
  },
  "watch": {  // ++++++
    "build": {
      "patterns": [
        "src",
        "public"
      ],
      "extensions": "js,html,scss,css,json,svg"
    }
  },
```

在开发过程中的调试如果需要在build后的开发环境中多次调试的话可以运行 `npm run watch` , 每次保存代码后会自动重新打包, 在 [扩展程序](chrome://extensions/) 中直接点击刷新按钮就可以实现刷新





































