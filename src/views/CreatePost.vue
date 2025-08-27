<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 标题国际化 -->
    <h1 class="text-2xl font-bold mb-6">{{ $t('createPost.title') }}</h1>

    <!-- 未登录时提示（国际化） -->
    <div v-if="!loginStore.token" class="text-center py-8">
      <p>{{ $t('createPost.loginPrompt') }}</p>
      <button @click="loginStore.openLoginModal()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {{ $t('header.signIn') }}
      </button>
    </div>

    <!-- 发帖表单（登录后显示） -->
    <form v-else @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
      <div class="mb-4">
        <label class="block mb-2">{{ $t('createPost.form.title') }}</label>
        <input 
          v-model="title" 
          class="w-full p-2 border border-gray-300 rounded text-black"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block mb-2">{{ $t('createPost.form.content') }}</label>
        <textarea 
          v-model="content" 
          class="w-full p-2 border border-gray-300 rounded text-black"
          rows="6"
          required
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="block mb-2">{{ $t('createPost.form.tags') }}</label>
        <input 
          v-model="tags" 
          class="w-full p-2 border border-gray-300 rounded text-black" 
          :placeholder="$t('createPost.form.tagsPlaceholder')"
        >
      </div>

      <div class="mb-4">
        <label class="block mb-2">{{ $t('createPost.form.type') }}</label>
        <select v-model="type" class="w-full p-2 border border-gray-300 rounded text-black">
          <option value="posts">{{ $t('createPost.form.postOption') }}</option>
          <option value="questions">{{ $t('createPost.form.questionOption') }}</option>
          <option value="videos">{{ $t('createPost.form.videoOption') }}</option>
        </select>
      </div>

      <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">
        {{ $t('createPost.form.publish') }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/store/loginStore';
import { useRouter } from 'vue-router';
import { api } from '@/api/index.js';

// 原有逻辑完全不变
const loginStore = useLoginStore();
const router = useRouter();

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
    router.push('/');
  } catch (err) {
    console.error('发帖失败:', err);
    alert('发帖失败：' + (err.response?.data?.msg || '请检查网络或登录状态'));
  }
};
</script>