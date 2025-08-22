import { defineStore } from 'pinia';
import { api } from '@/api/index.js';

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    showLoginModal: false,
    userInfo: null,
    token: localStorage.getItem('token') || null,
    loginError: null
  }),
  actions: {
    openLoginModal() {
      this.showLoginModal = true;
      this.loginError = null;
    },
    closeLoginModal() {
      this.showLoginModal = false;
    },
    async login(credentials) {
      this.loginError = null;
      try {
        const res = await api.post('/api/login', credentials);
        this.token = res.data.token;
        this.userInfo = res.data.user;
        this.closeLoginModal();
        return res.data.user;
      } catch (err) {
        this.loginError = err.response?.data?.msg || '登录失败，请检查邮箱和密码';
        throw err;
      }
    },
    async register(credentials) {
      this.loginError = null;
      try {
        const res = await api.post('/api/register', credentials);
        this.token = res.data.token;
        this.userInfo = res.data.user;
        this.closeLoginModal();
        return res.data.user;
      } catch (err) {
        this.loginError = err.response?.data?.msg || '注册失败，邮箱可能已被使用';
        throw err;
      }
    },
    logout() {
      this.userInfo = null;
      this.token = null;
    }
  },
  persist: true
});