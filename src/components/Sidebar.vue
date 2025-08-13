<template>
  <aside class="hidden md:block w-64 p-4 bg-gray-800 transition-all duration-300">
    <!-- Topics Section -->
    <div class="mb-8 border border-gray-700 rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold text-white">Topics</h3>
        <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>
      <ul>
        <!-- 动态渲染当前组的话题 -->
        <li class="mb-2 p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer" v-for="(topic, index) in currentTopics" :key="index">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">{{ topic.tag }}</span>
            <span class="text-xs text-green-400">{{ topic.count }}</span>
          </div>
        </li>
        <!-- Shuffle 按钮（可点击刷新） -->
        <div @click="shuffleTopics" class="mt-2 text-sm text-blue-400 text-right cursor-pointer hover:text-blue-300 transition-colors">
          Shuffle <span class="opacity-70">({{ currentPage }}/3)</span>
        </div>
      </ul>
    </div>

    <!-- Clubs Section -->
    <div class="border border-gray-700 rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold text-white">Clubs</h3>
        <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          More
        </button>
      </div>
      <ul>
        <li class="mb-3 p-2 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Government Activity Board</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">32.7k members</span>
              <button class="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">+</button>
            </div>
          </div>
        </li>
        <li class="mb-3 p-2 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Outdoor Lighting Decor</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">2,660 members</span>
              <button class="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">+</button>
            </div>
          </div>
        </li>
        <li class="mb-3 p-2 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Let's Make It Movie Night</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">2,520 members</span>
              <button class="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">+</button>
            </div>
          </div>
        </li>
        <li class="mb-3 p-2 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Show Off Your Gaming Setup</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">1,620 members</span>
              <button class="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">+</button>
            </div>
          </div>
        </li>
        <li class="mb-3 p-2 rounded hover:bg-gray-700 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Govee Light Festival</span>
            <div class="flex items-center">
              <span class="text-xs text-gray-400 mr-2">17.5k members</span>
              <button class="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">+</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

// 3组话题数据
const topicGroups = [
  [
    { tag: '# Govee Ice Maker', count: '673' },
    { tag: '# Outdoor Wall Light', count: '1.5k' },
    { tag: '# Outdoor Garden Light', count: '1.0k' }
  ],
  [
    { tag: '# HELP', count: '2.5k' },
    { tag: '# V7.1Feedback', count: '2.0k' },
    { tag: '# GoveeLightFestival', count: '8.2k' }
  ],
  [
    { tag: '# GoveeTableLamp2', count: '2.5k' },
    { tag: '# CreateYourTopic', count: '2.6k' },
    { tag: '# LIGHT&GUESS', count: '16.3k' }
  ]
];

// 当前显示的话题组和页码
const currentGroupIndex = ref(0);
const currentTopics = ref(topicGroups[currentGroupIndex.value]);
const currentPage = ref(1);

// 点击Shuffle切换话题组
const shuffleTopics = () => {
  currentGroupIndex.value = (currentGroupIndex.value + 1) % topicGroups.length;
  currentTopics.value = topicGroups[currentGroupIndex.value];
  currentPage.value = currentGroupIndex.value + 1;
};
</script>

<style scoped>
@media (max-width: 768px) {
  aside {
    display: none;
  }
}

@media (hover: none) {
  li:active {
    background-color: #4b5563;
  }
}
</style>