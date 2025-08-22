<template>
  <section class="p-4 md:p-8 w-full">
    <!-- 筛选栏 -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-100">Discover</h2>
      <div class="flex space-x-2">
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'all'"
          :class="{ 'bg-blue-500': activeTab === 'all' }"
        >
          All
        </button>
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'questions'"
          :class="{ 'bg-blue-500': activeTab === 'questions' }"
        >
          Questions
        </button>
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'posts'"
          :class="{ 'bg-blue-500': activeTab === 'posts' }"
        >
          Posts
        </button>
        <button 
          class="px-3 py-1 text-sm text-gray-100 bg-gray-700 rounded"
          @click="activeTab = 'videos'"
          :class="{ 'bg-blue-500': activeTab === 'videos' }"
        >
          Videos
        </button>
      </div>
    </div>

    <!-- 内容卡片（修复头像绑定） -->
    <div class="space-y-4">
      <router-link 
        :to="`/post/${post.id}`" 
        class="block"
        v-for="post in filteredPosts" 
        :key="post.id"
      >
        <div class="p-4 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center mb-2">
            <!-- 头像：动态绑定后端返回的头像地址 -->
            <router-link :to="`/user/${post.author?.id}`"> <!-- 动态跳转用户主页 -->
              <img 
                :src="post.author?.avatar" 
                :alt="`${post.author?.username}'s avatar`" 
                class="w-10 h-10 mr-2 rounded-full object-cover border-2 border-gray-600"
                v-if="post.author?.avatar" 
              >
              <!-- 头像不存在时显示默认图标 -->
              <div v-else class="w-10 h-10 mr-2 rounded-full bg-gray-600 flex items-center justify-center">
                <span class="text-gray-300 text-sm">{{ post.author?.username?.charAt(0) || '?' }}</span>
              </div>
            </router-link>
            <!-- 动态显示用户名 -->
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
              <span class="ml-1">{{ post.likes }} Likes</span>
            </button>
            <span>{{ post.comments?.length || 0 }} Comments</span>
            <span>{{ formatDate(post.date) }}</span>
            <!-- 添加删除和举报按钮 -->
            <div class="ml-auto flex space-x-2">
              <!-- 举报按钮 - 所有人可见 -->
              <button 
                @click.stop="handleReport(post.id)" 
                class="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Report
              </button>
              
              <!-- 删除按钮 - 仅作者可见 -->
              <button 
                @click.stop="handleDelete(post.id)" 
                class="text-sm text-gray-400 hover:text-red-400 transition-colors"
                v-if="isAuthor(post)"
              >
                Delete
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

const postStore = usePostStore();
const userStore = useUserStore(); // 获取用户存储实例
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
  if (!dateString) return ''; // 处理日期为空的情况
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
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
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await postStore.deletePost(postId);
      // 删除成功后重新获取帖子列表
      postStore.fetchPosts(activeTab.value);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};

// 处理举报帖子
const handleReport = async (postId) => {
  if (confirm('Report this post? This action cannot be undone.')) {
    try {
      await postStore.reportPost(postId);
      alert('Post reported successfully');
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to report post');
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