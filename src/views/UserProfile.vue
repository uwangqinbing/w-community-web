<template>
  <div class="p-4">
    <!-- 返回按钮 -->
    <button 
      @click="$router.back()" 
      class="mb-4 text-cyan-400 hover:underline"
    >
      ← 返回
    </button>
    
    <!-- 用户信息 -->
    <div class="bg-gray-800 p-6 rounded-lg">
      <h1 class="text-2xl font-bold text-white mb-4">{{ username }} 的主页</h1>
      <p class="text-gray-300">这里是 {{ username }} 的个人信息和发布的内容...</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// 接收路由参数
const props = defineProps({
  username: {
    type: String,
    required: true
  }
})
</script>