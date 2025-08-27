import { defineStore } from 'pinia';
import { api } from '@/api/index.js';
import { useLoginStore } from './loginStore';
import { getActivePinia } from 'pinia';

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
      const pinia = getActivePinia();
      const loginStore = useLoginStore(pinia);
      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        const res = await api.post(`/api/posts/${postId}/like`);
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

    // 删除帖子
    async deletePost(postId) {
      const pinia = getActivePinia();
      const loginStore = useLoginStore(pinia);

      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        await api.delete(`/api/posts/${postId}`);
        this.posts = this.posts.filter(post => post.id !== postId);
        if (this.currentPost?.id === postId) {
          this.currentPost = null;
        }
        return true;
      } catch (err) {
        console.error('删除帖子失败:', err);
        return false;
      }
    },

    async deleteComment(postId, commentId) {
      const pinia = getActivePinia();
      const loginStore = useLoginStore(pinia);

      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        await api.delete(`/api/posts/${postId}/comments/${commentId}`);

        if (this.currentPost && this.currentPost.comments) {
          this.currentPost.comments = this.currentPost.comments.filter(
            comment => comment.id !== commentId
          );
        }
        return true;
      } catch (err) {
        console.error('删除评论失败:', err);
        return false;
      }
    },

    // 举报帖子
    async reportPost(postId, reason) {
      const pinia = getActivePinia();
      const loginStore = useLoginStore(pinia);
      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        await api.post(`/api/posts/${postId}/report`, { reason });
        return true;
      } catch (err) {
        console.error('举报帖子失败:', err);
        return false;
      }
    },

    clearCurrentPost() {
      this.currentPost = null;
    }
  }
});