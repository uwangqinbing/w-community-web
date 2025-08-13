<template>
  <header class="bg-gray-900 shadow-sm"> 
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo 区域 -->
      <div class="flex items-center space-x-2">
        <img src="../assets/vue.svg" alt="Logo" class="h-8 w-auto">
        <span class="text-xl font-bold text-white">Govee</span> 
      </div>

      <!-- 搜索栏区域 -->
      <div class="flex-1 max-w-md mx-8">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleInput" 
            @focus="showSearchResults = true"
            @keydown.enter="handleSearchSubmit" 
            placeholder="Search for posts,topics,and users"
            class="w-full py-2 px-4 pr-10 rounded-full border border-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   text-white bg-gray-800" 
          >
          <button @click="handleSearchSubmit" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div 
          v-if="showSearchResults && searchResults.length > 0" 
          class="absolute z-10 mt-2 w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        >
          <div 
            v-for="result in searchResults" 
            :key="result.id" 
            class="p-3 hover:bg-gray-700 cursor-pointer" 
            @click="goToPostDetail(result.id)"
          >
            <h3 class="font-medium text-white" v-html="highlightKeyword(result.title)"></h3>
            <p class="text-sm text-gray-300" 
               v-html="highlightKeyword(result.content.substring(0, 50) + (result.content.length > 50 ? '...' : ''))">
            </p>
          </div>
        </div>

        <div 
          v-if="showSearchResults && searchResults.length === 0 && searchQuery" 
          class="absolute z-10 mt-2 w-full bg-gray-800 shadow-lg rounded-lg p-3 text-gray-400"
        >
          没有找到与「{{ searchQuery }}」相关的内容
        </div>
      </div>

      <!-- 用户操作区域 -->
      <div class="flex items-center space-x-4">
        <button 
          v-if="!userInfo" 
          @click="loginStore.openLoginModal()" 
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600"
        >
          Sign in
        </button>
        <button 
          v-if="userInfo" 
          @click="handleLogout" 
          class="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:from-red-600 hover:to-orange-600"
        >
          Sign out
        </button>
        <button 
          v-if="userInfo" 
          class="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600"
        >
          Post
        </button>
        <!-- 用户信息：头像+用户名 -->
        <div v-if="userInfo" class="flex items-center space-x-2">
          <img 
            :src="userInfo.avatar || '/default-avatar.png'" 
            alt="User Avatar" 
            class="h-8 w-8 rounded-full"
          >
          <span class="text-white">{{ userInfo.username }}</span>
        </div>
      </div>
    </div>
  </header>
  <LoginModal
    v-if="loginStore.showLoginModal"
    :visible="loginStore.showLoginModal"
    @close="loginStore.closeLoginModal()"
    @login="handleLogin"
  />
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/store/loginStore';
import { useSearchStore } from '@/store/searchStore';
import LoginModal from './LoginModal.vue';

const router = useRouter();
const loginStore = useLoginStore();
const searchStore = useSearchStore();

const searchQuery = ref('');
const showSearchResults = ref(false);
const searchResults = ref([]);
const userInfo = ref(null);
let debounceTimer = null;

const highlightKeyword = (text) => {
  if (!searchQuery.value) return text;
  const keyword = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span class="text-red-600 font-medium">$1</span>');
};

const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchStore.performSearch(searchQuery.value);
      searchResults.value = searchStore.searchResults;
      showSearchResults.value = true;
    } else {
      searchResults.value = [];
      showSearchResults.value = false;
    }
  }, 200);
};

const handleSearchSubmit = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', params: { query: searchQuery.value.trim() } });
    showSearchResults.value = false;
  }
};

watch(() => loginStore.userInfo, (newVal) => {
  userInfo.value = newVal;
}, { immediate: true });

watch(() => searchStore.searchResults, (newResults) => {
  searchResults.value = newResults;
});

onMounted(() => {
  const query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    searchQuery.value = query;
    nextTick(() => searchStore.performSearch(query));
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) showSearchResults.value = false;
  });
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});

const goToPostDetail = (postId) => {
  router.push(`/post/${postId}`);
  showSearchResults.value = false;
};

const handleLogin = async (credentials) => {
  console.log('接收登录信息:', credentials); 
  try {
    await loginStore.login(credentials);
    console.log('登录成功');
    loginStore.closeLoginModal(); 
  } catch (error) {
    console.error('登录失败:', error);
  }
};
const handleLogout = () => loginStore.logout();
</script>

<style scoped>
input::placeholder {
  color: #bbbbbb; 
}
</style>