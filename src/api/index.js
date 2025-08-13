import axios from 'axios';
import { useLoginStore } from '@/store/loginStore';

// 创建 axios 实例（对接后端地址）
const api = axios.create({
    baseURL: 'http://localhost:5000', // 后端根地址
    withCredentials: true, // 关键：允许携带 Cookie（解决跨域凭证问题）
});

// 请求拦截器：自动添加 token 到请求头
api.interceptors.request.use(
    async (config) => {
        const loginStore = useLoginStore();
        if (loginStore.token) {
            config.headers.Authorization = `Bearer ${loginStore.token}`;
        }
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
            const loginStore = useLoginStore();
            loginStore.logout();
            loginStore.openLoginModal();
        }
        return Promise.reject(error);
    }
);

export { api };