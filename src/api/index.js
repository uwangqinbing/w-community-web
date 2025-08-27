import axios from 'axios';
import { getActivePinia } from 'pinia';
import { useLoginStore } from '@/store/loginStore';
import i18n from '@/i18n';

// 创建 axios 实例（对接后端地址）
const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

// 请求拦截器：自动添加 token 到请求头
api.interceptors.request.use(
    async (config) => {
        const pinia = getActivePinia();
        const loginStore = useLoginStore(pinia);
        if (loginStore.token) {
            config.headers.Authorization = `Bearer ${loginStore.token}`;
        }
        config.params = { ...config.params, lang: i18n.global.locale.value };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理 token 过期（401 错误）
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 处理 401 错误（token 无效或过期）
        if (error.response?.status === 401) {
            const pinia = getActivePinia();
            const loginStore = useLoginStore(pinia);
            loginStore.logout();
            loginStore.openLoginModal();
        }
        return Promise.reject(error);
    }
);

export const deletePost = (postId) => {
    return api.delete(`/api/posts/${postId}`);
};

export const deleteComment = (postId, commentId) => {
    return api.delete(`/api/posts/${postId}/comments/${commentId}`);
};

export { api };