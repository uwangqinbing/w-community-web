# Govee项目说明文档

## 一、项目概述
WN 是基于 Vue 3 生态构建的社区交流平台，专注于 Govee 产品用户互动场景（如设备讨论、经验分享等）。
通过 Vue 3 + Vite 实现高效开发，Pinia 管理全局状态，Vue Router 处理路由，Tailwind CSS 快速构建样式，为用户提供轻量化、响应式的社区体验。

## 二、核心技术栈
| 技术栈       | 作用说明                              |  
| ------------ | ------------------------------------- |  
| Vue 3        | 前端框架，实现组件化开发              |  
| Vite         | 构建工具，提供快速的冷启动和热模块替换 |  
| Pinia        | 状态管理库，用于管理应用的全局状态    |  
| Vue Router   | 路由管理库，用于处理应用的路由        |  
| Tailwind CSS | utility-first CSS 框架，用于快速构建响应式样式 |  

## 三、项目结构  
w-community-web  
- src(核心代码目录)  
  - assets(静态资源)
  - components(通用组件)
      - Discover.vue(发现页组件)
      - Footer.vue(页脚组件)
      - Header.vue(页眉组件)
      - LoginModal.vue(登录弹窗)
      - Sidebar.vue(侧边栏)
  - router(路由配置)
      - index.js(定义页面路由规则)
  - store(状态管理,Pinia 仓库) 
      - loginStore.js(登录状态)  
      - postStore.js(帖子状态)  
      - searchStore.js(搜索状态)  
  - views(页面级组件,路由直接渲染) 
      - PostDetail.vue(帖子详情页)
      - SearchResult.vue(搜索结果页)
      - UserProfile.vue(用户主页)  
  - App.vue(根组件,页面布局容器)  
  - main.js(项目入口,初始化 Vue 实例)  
  - style.css(全局样式)  
  - tailwind.css(引入 Tailwind CSS 基础样式)  
- public(纯静态资源)  
- .gitignore(Git 忽略规则)  
- index.html(页面模板,Vue 挂载入口)  
- package.json(项目依赖、脚本配置)  
- package-lock.json(依赖版本锁定文件)  
- postcss.config.js(PostCSS 配置)  
- tailwind.config.js(Tailwind CSS 自定义配置)  
- README.md(项目说明文档)   
- vite.config.js(Vite 构建工具配置)  
## 四、项目功能
### 快速上手指南
1. 环境准备
确保本地安装：Node.js、npm

2. 启动开发环境
   克隆项目：
   ```bash
   git clone https://github.com/uwangqinbing/vue-project2/w-community-web.git
   ```
   进入项目目录：
   ```bash
   cd w-community-web
   ```
   安装依赖：
   ```bash
   npm install
   ```
   启动项目：
   ```bash
   npm run dev
   ```

3. 打包生产环境
   项目开发完成后，使用以下命令打包：
   ```bash
   npm run build
   ```
   打包后的文件将生成在 dist 目录下，可直接部署到服务器。

## 五、关键功能说明
1. 发现页（Discover.vue）
   - 显示最新帖子、热门话题等
   - 支持帖子预览、快速导航

2. 帖子详情页（PostDetail.vue）
   - 帖子内容展示
   - 评论区功能（评论列表、评论发布）
   - 点赞、收藏等交互功能

3. 用户中心页（UserCenter.vue）
   - 用户信息展示
   - 用户动态展示
   - 用户设置功能

4. 搜索结果页（SearchResult.vue）
   - 搜索结果展示
     - 支持帖子、用户等多维度搜索

5. 登录弹窗（LoginModal.vue）
   - 登录功能
   - 注册功能

6. 侧边栏（Sidebar.vue）
   - 热门话题展示
   - 社群俱乐部入口

7. 底部页脚（Footer.vue）
   - 联系我们
   - 法律声明
   - 隐私政策

## 六、常见问题
1. 依赖安装失败，npm install 报错
   ```bash
   rm -rf node_modules package-lock.json                  # 删除缓存文件
   npm install --registry=https://registry.npmmirror.com  # 换镜像重试（如淘宝镜像）
   ```

2. 样式不生效
   检查 tailwind.config.js 的 content 配置，确保包含所有 Vue 文件

3. 路由跳转 404
   确保 router/index.js 配置正确，且 main.js 正确引入路由

## 七、扩展开发建议
1. 接口对接：建议在 src 目录下创建 api 文件夹，集中管理所有接口请求
2. 功能扩展：新增功能时建议遵循现有项目结构，保持代码一致性
