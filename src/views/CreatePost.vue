<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Create New Post</h1>

    <!-- 未登录时提示 -->
    <div v-if="!loginStore.token" class="text-center py-8">
      <p>请先登录才能发帖</p>
      <button @click="loginStore.openLoginModal()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        登录
      </button>
    </div>

    <!-- 发帖表单（登录后显示） -->
    <form v-else @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
      <div class="mb-4">
        <label class="block mb-2">Title</label>
        <input 
          v-model="title" 
          class="w-full p-2 border border-gray-300 rounded text-black"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block mb-2">Content</label>
        <textarea 
          v-model="content" 
          class="w-full p-2 border border-gray-300 rounded text-black"
          rows="6"
          required
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="block mb-2">Tags (comma separated)</label>
        <input 
          v-model="tags" 
          class="w-full p-2 border border-gray-300 rounded text-black" 
          placeholder="e.g., led, review, govee"
        >
      </div>

      <div class="mb-4">
        <label class="block mb-2">Type</label>
        <select v-model="type" class="w-full p-2 border border-gray-300 rounded text-black">
          <option value="posts">Post</option>
          <option value="questions">Question</option>
          <option value="videos">Video</option>
        </select>
      </div>

      <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">
        Publish Post
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/store/loginStore';
import { useRouter } from 'vue-router';
import { api } from '@/api/index.js';

const loginStore = useLoginStore();
const router = useRouter();

// 表单数据
const title = ref('');
const content = ref('');
const tags = ref('');
const type = ref('posts');

const handleSubmit = async () => {
  try {
    await api.post('/api/posts', {
      title: title.value,
      content: content.value,
      tags: tags.value,
      type: type.value,
      authorId: loginStore.userInfo.id,
      authorAvatar: loginStore.userInfo.avatar || '/OIP-C.webp', 
      date: new Date().toISOString().split('T')[0]
    });
    // 发帖成功后跳回帖子列表
    router.push('/');
  } catch (err) {
    console.error('发帖失败:', err);
    alert('发帖失败：' + (err.response?.data?.msg || '请检查网络或登录状态'));
  }
};
</script>