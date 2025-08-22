import { defineStore } from 'pinia';
import { api } from '@/api/index.js';  // 保持原有导入方式
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

    // 删除帖子（保留你已有的实现）
    async deletePost(postId) {
      const loginStore = useLoginStore();
      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        await api.delete(`/api/posts/${postId}`);
        // 从列表中移除删除的帖子
        this.posts = this.posts.filter(post => post.id !== postId);
        // 如果删除的是当前查看的帖子，清除当前帖子数据
        if (this.currentPost?.id === postId) {
          this.currentPost = null;
        }
        return true;
      } catch (err) {
        console.error('删除帖子失败:', err);
        return false;
      }
    },

    // 新增：删除评论功能（仅添加此方法，不修改原有代码）
    async deleteComment(postId, commentId) {
      const loginStore = useLoginStore();
      if (!loginStore.token) {
        loginStore.openLoginModal();
        return Promise.reject(new Error('请先登录'));
      }

      try {
        // 调用删除评论接口
        await api.delete(`/api/posts/${postId}/comments/${commentId}`);

        // 更新当前帖子的评论列表（不影响其他功能）
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

    // 举报帖子（保留原有实现）
    async reportPost(postId, reason) {
      const loginStore = useLoginStore();
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
