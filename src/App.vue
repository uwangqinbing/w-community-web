<!-- src/App.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-gray-900">
    <!-- 顶部导航 -->
    <Header />

    <!-- 主体布局：侧边栏 + 内容区 -->
    <main class="flex flex-1 md:flex-row">
      <!-- 侧边栏（仅桌面端） -->
      <Sidebar />

      <!-- 内容区（占满剩余空间） -->
      <div class="w-full md:w-2/3 p-4">
        <router-view></router-view> 
      </div>
    </main>

    <!-- 底部信息 -->
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'
import { usePostStore } from './store/postStore.js';
</script>

<style scoped>
/* 移动端布局适配 */
@media (max-width: 768px) {
  main {
    flex-direction: column;
  }
}
</style>

const postStore = usePostStore();
postStore.init();