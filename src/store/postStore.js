import { defineStore } from 'pinia';
import { api } from '@/api/index.js';
import { useLoginStore } from './loginStore';

export const usePostStore = defineStore('postStore', {
  state: () => ({
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchPosts(type = 'all') {
      this.isLoading = true;
      try {
        const res = await api.get(`/api/posts?type=${type}`);
        this.posts = res.data;
        this.error = null;
      } catch (err) {
        this.error = 'Failed to load posts';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. 获取帖子详情
    async fetchPostDetail(postId) {
      this.isLoading = true;
      this.error = null;
      this.currentPost = null;

      try {
        const res = await api.get(`/api/posts/${postId}`);
        this.currentPost = res.data;
      } catch (err) {
        this.error = 'Post not found';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    // 3. 点赞功能（调用后端接口）
    async toggleLike(postId) {
      const loginStore = useLoginStore();
      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        const res = await api.post(`/api/posts/${postId}/like`);
        // 更新本地状态
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.likes = res.data.likes;
          post.isLiked = res.data.isLiked;
        }
        if (this.currentPost?.id === postId) {
          this.currentPost.likes = res.data.likes;
          this.currentPost.isLiked = res.data.isLiked;
        }
      } catch (err) {
        console.error('点赞失败:', err);
      }
    },

    clearCurrentPost() {
      this.currentPost = null;
    }
  }
});