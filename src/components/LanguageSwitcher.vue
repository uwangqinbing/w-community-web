<template>
  <select 
    v-model="currentLocale" 
    @change="handleChange"
    class="bg-gray-800 text-white p-2 rounded ml-4 border border-gray-600"
  >
    <option value="en">English</option>
    <option value="zh-CN">简体中文</option>
  </select>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const currentLocale = locale; // 双向绑定当前语言

// 切换语言时持久化到本地存储
const handleChange = () => {
  localStorage.setItem('locale', currentLocale.value);
};
</script>