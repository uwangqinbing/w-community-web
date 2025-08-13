<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 搜索框复用 -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        @input="handleInput"
        @keydown.enter="handleSearch"
        placeholder="继续搜索..."
        class="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <button @click="handleSearch" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        搜索
      </button>
    </div>

    <!-- 结果列表 -->
    <div v-if="searchStore.searchResults.length > 0" class="space-y-4">
      <router-link 
        :to="`/post/${post.id}`" 
        class="block p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
        v-for="post in searchStore.searchResults" 
        :key="post.id"
      >
        <h3 class="text-lg font-bold text-gray-800" v-html="highlightKeyword(post.title)"></h3>
        <p class="text-sm text-gray-600" 
           v-html="highlightKeyword(
             post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
           )">
        </p>
        <div class="mt-2 text-sm text-gray-500">
          作者: {{ post.author }} | 日期: {{ post.date }}
        </div>
      </router-link>
    </div>

    <!-- 无结果提示 -->
    <div v-else-if="searchQuery" class="text-center py-8 text-gray-500">
      没有找到与「{{ searchQuery }}」相关的内容
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/store/searchStore';

const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
let debounceTimer = null;

// 关键词高亮
const highlightKeyword = (text) => {
  if (!searchQuery.value) return text;
  const keyword = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span class="text-red-600 font-medium">$1</span>');
};

// 防抖搜索
const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchStore.performSearch(searchQuery.value);
    }
  }, 200);
};

// 执行搜索并更新URL
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } });
    searchStore.performSearch(searchQuery.value);
  }
};

// 页面加载时从URL获取关键词
onMounted(() => {
  const query = route.query.q || '';
  if (query) {
    searchQuery.value = query;
    searchStore.performSearch(query);
  }
});

// 清理计时器
onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>
