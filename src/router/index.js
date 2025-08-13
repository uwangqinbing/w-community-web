// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import PostList from '@/views/PostList.vue'; // 帖子列表页
import PostDetail from '@/views/PostDetail.vue'; // 帖子详情页
import CreatePost from '@/views/CreatePost.vue'; // 发帖页
import SearchResult from '@/views/SearchResult.vue'; // 搜索结果页
import UserProfile from '@/views/UserProfile.vue'; // 用户个人主页

const routes = [
  { path: '/', name: 'PostList', component: PostList },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail },
  { path: '/create', name: 'CreatePost', component: CreatePost },
  { path: '/search', name: 'SearchResult', component: SearchResult },
  { path: '/user/:id', name: 'UserProfile', component: () => import('@/views/UserProfile.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/public/')) {
    next(false);
    return;
  }
  next();
});

export default router;