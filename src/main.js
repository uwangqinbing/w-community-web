import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import { createMetaManager } from 'vue-meta';
import './style.css'
import './tailwind.css'
import App from './App.vue' 
import router from './router'  

// 创建 Vue 应用实例
const app = createApp(App) 
app.use(createMetaManager())
app.use(createPinia()) 
app.use(router) 
app.mount('#app') 