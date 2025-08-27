<template>
  <section class="p-4 md:p-8 w-full">
    <!-- 筛选栏 -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-100">{{ $t('discover.title') }}</h2>
      <div class="flex space-x-2">
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'all'"
          :class="{ 'bg-blue-500': activeTab === 'all' }"
        >
          {{ $t('discover.all') }}
        </button>
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'questions'"
          :class="{ 'bg-blue-500': activeTab === 'questions' }"
        >
          {{ $t('discover.questions') }}
        </button>
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'posts'"
          :class="{ 'bg-blue-500': activeTab === 'posts' }"
        >
          {{ $t('discover.posts') }}
        </button>
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'videos'"
          :class="{ 'bg-blue-500': activeTab === 'videos' }"
        >
          {{ $t('discover.videos') }}
        </button>
      </div>
    </div>

    <!-- 内容卡片 -->
    <div class="space-y-4">
      <router-link 
        :to="`/post/${post.id}`" 
        class="block"
        v-for="post in filteredPosts" 
        :key="post.id"
      >
        <div class="p-4 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center mb-2">
            <router-link :to="`/user/${post.author?.id}`">
              <img 
                :src="post.author?.avatar" 
                :alt="`${post.author?.username}'s avatar`" 
                class="w-10 h-10 mr-2 rounded-full object-cover border-2 border-gray-600"
                v-if="post.author?.avatar" 
              >
              <div v-else class="w-10 h-10 mr-2 rounded-full bg-gray-600 flex items-center justify-center">
                <span class="text-gray-300 text-sm">{{ post.author?.username?.charAt(0) || '?' }}</span>
              </div>
            </router-link>
            <span class="text-lg font-bold text-gray-100">{{ post.author?.username || 'Unknown' }}</span>
          </div>
          <h3 class="mb-2 text-lg font-bold text-cyan-400">{{ post.title }}</h3>
          <p class="text-sm text-gray-300">
            {{ post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content }}
          </p>

          <div class="flex flex-wrap mt-2 space-x-2" v-if="post.image">
            <img 
              :src="post.image.startsWith('http') ? post.image : `/public/${post.image}`" 
              :alt="`Post image for ${post.title}`" 
              class="w-1/4 md:w-1/6 rounded"
            >
          </div>

          <div class="flex items-center mt-2 space-x-4 text-gray-300">
            <button @click.stop="toggleLike(post.id)" class="flex items-center">
              <span :class="post.isLiked? 'text-red-500' : 'text-gray-600'">❤</span>
              <span class="ml-1">{{ post.likes }} {{ $t('discover.likes') }}</span>
            </button>
            <span>{{ post.comments?.length || 0 }} {{ $t('discover.comments') }}</span>
            <span>{{ formatDate(post.date) }}</span>
            <div class="ml-auto flex space-x-2">
              <button 
                @click.stop="handleReport(post.id)" 
                class="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                {{ $t('discover.report') }}
              </button>
              
              <button 
                @click.stop="handleDelete(post.id)" 
                class="text-sm text-gray-400 hover:text-red-400 transition-colors"
                v-if="isAuthor(post)"
              >
                {{ $t('discover.delete') }}
              </button>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { usePostStore } from '@/store/postStore';
import { useUserStore } from '@/store/userStore';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'; // 引入i18n组合式API

// 初始化i18n
const { t } = useI18n();

const postStore = usePostStore();
const userStore = useUserStore();
const router = useRouter();
const activeTab = ref('all');

onMounted(() => {
  postStore.fetchPosts(activeTab.value);
});

watch(activeTab, (newVal) => {
  postStore.fetchPosts(newVal);
});

const filteredPosts = computed(() => {
  if (activeTab.value === 'all') {
    return postStore.posts; 
  }
  return postStore.posts.filter(post => post.type === activeTab.value);
});

const isAuthor = (post) => {
  return userStore.user?.id && post.author?.id && userStore.user.id === post.author.id;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // 根据当前语言切换日期格式
  return new Intl.DateTimeFormat(t('discover.dateLocale'), {
    hour: 'numeric',
    minute: '2-digit',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const toggleLike = (postId) => {
  postStore.toggleLike(postId);
};

const handleDelete = async (postId) => {
  // 使用国际化提示信息
  if (confirm(t('discover.deleteConfirm'))) {
    try {
      await postStore.deletePost(postId);
      postStore.fetchPosts(activeTab.value);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};

const handleReport = async (postId) => {
  // 使用国际化提示信息
  if (confirm(t('discover.reportConfirm'))) {
    try {
      await postStore.reportPost(postId);
      alert(t('discover.reportSuccess'));
    } catch (error) {
      console.error('Error reporting post:', error);
      alert(t('discover.reportFailed'));
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}

.bg-blue-500 {
  background-color: #007bff !important;
}

button:hover {
  cursor: pointer;
}
.text-red-500 {
  color: #ef4444;
}
</style>