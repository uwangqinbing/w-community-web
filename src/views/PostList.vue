<!-- src/views/PostList.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Discover</h1>
      <button 
        @click="router.push('/create')" 
        class="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600"
        v-if="loginStore.userInfo"
      >
        New Post
      </button>
    </div>

    <!-- 分类筛选（添加Videos按钮，变为4个） -->
    <div class="flex gap-2 mb-6">
      <button 
        @click="fetchPosts('all')" 
        :class="activeType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded transition-colors"
      >
        All
      </button>
      <button 
        @click="fetchPosts('posts')" 
        :class="activeType === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded transition-colors"
      >
        Posts
      </button>
      <button 
        @click="fetchPosts('questions')" 
        :class="activeType === 'questions' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded transition-colors"
      >
        Questions
      </button>
      <!-- 新增Videos按钮 -->
      <button 
        @click="fetchPosts('videos')" 
        :class="activeType === 'videos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded transition-colors"
      >
        Videos
      </button>
    </div>

    <!-- 帖子列表（修复头像绑定+统一样式） -->
    <div class="space-y-4">  <!-- 改用space-y-4，与Discover.vue一致 -->
      <router-link 
        :to="`/post/${post.id}`" 
        class="block"
        v-for="post in postStore.posts" 
        :key="post.id"
      >
        <div class="p-4 bg-gray-800 rounded hover:bg-gray-700 transition-colors">  <!-- 与Discover.vue卡片样式一致 -->
          <div class="flex items-center mb-2">
            <!-- 头像：统一绑定post.author.avatar（与Discover.vue一致） -->
            <router-link :to="`/user/${post.authorId}`" class="inline-block">
              <img 
                :src="post.author?.avatar"
                :alt="`${post.author?.username}'s avatar`" 
                class="w-10 h-10 mr-2 rounded-full object-cover"
                v-if="post.author?.avatar"
>

<!-- 头像缺失时的默认容器 -->
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

          <!-- 帖子图片（与Discover.vue一致） -->
          <div class="flex flex-wrap mt-2 space-x-2" v-if="post.image">
            <img 
              :src="`/public/${post.image}`" 
              :alt="`Post image for ${post.title}`" 
              class="w-1/4 md:w-1/6 rounded"
            >
          </div>

          <!-- 互动数据（与Discover.vue一致） -->
          <div class="flex items-center mt-2 space-x-4 text-gray-300">
            <button @click.stop="toggleLike(post.id)" class="flex items-center">
              <span :class="post.isLiked? 'text-red-500' : 'text-gray-600'">❤</span>
              <span class="ml-1">{{ post.likes }} Likes</span>
            </button>
            <span>{{ post.comments?.length || 0 }} Comments</span>
            <span>{{ formatDate(post.date) }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from '@/store/postStore';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/store/loginStore';  // 引入登录状态

const postStore = usePostStore();
const router = useRouter();
const loginStore = useLoginStore();  // 实例化登录store
const activeType = ref('all');

// 日期格式化（复用Discover.vue逻辑）
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// 点赞功能（复用postStore逻辑）
const toggleLike = (postId) => {
  postStore.toggleLike(postId);
};

// 获取帖子列表（支持videos类型）
const fetchPosts = (type) => {
  activeType.value = type;
  postStore.fetchPosts(type);  // 调用store方法，后端会返回对应类型数据
};

// 页面加载时获取所有帖子
onMounted(() => {
  fetchPosts('all');
});
</script>

<style scoped>
/* 复用Discover.vue的样式，确保一致性 */
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
img[alt$="avatar"] {
  box-sizing: border-box;
}
::v-deep .rounded-full {
  border-radius: 9999px !important;
}

/* 确保宽高严格相等（针对头像） */
::v-deep .w-10 {
  width: 2.5rem !important;
}
::v-deep .h-10 {
  height: 2.5rem !important;
}
</style>