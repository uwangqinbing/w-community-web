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

    <!-- 分类筛选-->
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

    <!-- 帖子列表（修复头像绑定+统一样式 + 判空保护） -->
    <div class="space-y-4"> 
      <router-link 
        :to="`/post/${post.id}`" 
        class="block"
        v-for="post in postStore.posts" 
        :key="post.id"
      >
        <!-- 核心修复：用 v-if="post" 确保 post 存在再渲染 -->
        <div 
          v-if="post" 
          class="p-4 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
        >  
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

          <!-- 互动数据（与Discover.vue一致 + 判空保护） -->
          <div class="flex items-center mt-2 space-x-4 text-gray-300">
            <button @click.stop="toggleLike(post.id)" class="flex items-center">
              <span :class="post?.isLiked ? 'text-red-500' : 'text-gray-600'">❤</span>
              <span class="ml-1">{{ post?.likes || 0 }} Likes</span>
            </button>
            <span>{{ post?.comments?.length || 0 }} Comments</span>
            <span>{{ formatDate(post?.date) }}</span>
            <button 
              v-if="post.authorId === loginStore.userInfo?.id"
              @click.stop="handleDeletePost(post.id)"
              class="text-red-500 text-sm hover:underline"
            >
             删除
            </button>
          </div>
        </div>
      </router-link>
    </div>

    <!-- 举报弹窗 -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">举报帖子</h3>
        <textarea 
          v-model="reportReason" 
          class="w-full p-2 border border-gray-300 rounded mb-4"
          rows="3"
          placeholder="请输入举报理由..."
        ></textarea>
        <div class="flex justify-end space-x-2">
          <button @click="showReportModal = false" class="px-4 py-2 border border-gray-300 rounded">取消</button>
          <button @click="handleReport" class="px-4 py-2 bg-red-500 text-white rounded">提交举报</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from '@/store/postStore';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/store/loginStore';  

const postStore = usePostStore();
const router = useRouter();
const loginStore = useLoginStore();  
const activeType = ref('all');
const showReportModal = ref(false);
const reportReason = ref('');
const currentReportPostId = ref(null);

// 处理删除
const handleDelete = async (postId) => {
  if (confirm('确定要删除这篇帖子吗？')) {
    await postStore.deletePost(postId);
    // 删除后重新拉取数据（可选，确保界面更新）
    fetchPosts(activeType.value);
  }
};

// 打开举报弹窗
const openReportModal = (postId) => {
  currentReportPostId.value = postId;
  reportReason.value = '';
  showReportModal.value = true;
};

// 处理举报
const handleReport = async () => {
  if (!reportReason.value.trim()) {
    alert('请输入举报理由');
    return;
  }
  
  const success = await postStore.reportPost(currentReportPostId.value, reportReason.value);
  if (success) {
    alert('举报已提交，感谢您的反馈');
    showReportModal.value = false;
  } else {
    alert('举报提交失败，请稍后重试');
  }
};

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
  postStore.fetchPosts(type);  
};

// 页面加载时获取所有帖子
onMounted(() => {
  fetchPosts('all');
});

const handleDeletePost = async (postId) => {
  if (confirm('确定要删除这篇帖子吗？此操作不可撤销。')) {
    const success = await postStore.removePost(postId);
    if (success) {
      // 可选择显示删除成功提示
    }
  }
};
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
::deep(.rounded-full) {
  border-radius: 9999px !important;
}

/* 确保宽高严格相等（针对头像） */
::deep(.w-10) {
  width: 2.5rem !important;
}
::deep(.h-10) {
  height: 2.5rem !important;
}
</style>