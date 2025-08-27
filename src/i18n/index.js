import { createI18n } from 'vue-i18n';
import en from './locales/en';
import zhCN from './locales/zh-CN';

// 从本地存储获取默认语言（优先用户设置，默认英文）
const defaultLocale = localStorage.getItem('locale') || 'en';

const i18n = createI18n({
    legacy: false, // 启用 Vue 3 组合式 API
    locale: defaultLocale,
    fallbackLocale: 'en', // 语言缺失时默认使用英文
    messages: {
        en,
        'zh-CN': zhCN
    }
});

export default i18n;