import { defineStore } from 'pinia';

export const useSearchStore = defineStore('searchStore', {
  state: () => ({
    searchQuery: '',
    searchResults: [],
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalResults: 0,
    // Mock posts database
    posts: [
      {
        id: 1,
        title: 'Govee LED Strip Review',
        content: 'I recently purchased the Govee LED strip and it exceeded my expectations...',
        author: 'TechLover',
        authorId: 1,
        date: '2023-06-15',
        tags: ['led', 'review', 'govee'],
        image: '/post-images/led-strip.jpg'
      },
      {
        id: 2,
        title: 'Setting up Govee Smart Bulbs',
        content: 'Here\'s a step-by-step guide to setting up your Govee smart bulbs...',
        author: 'SmartHomeExpert',
        authorId: 2,
        date: '2023-06-20',
        tags: ['smart bulbs', 'setup', 'tutorial'],
        image: '/post-images/smart-bulb.jpg'
      },
      {
        id: 3,
        title: 'Govee vs Phillips Hue',
        content: 'A detailed comparison between Govee and Phillips Hue smart lighting systems...',
        author: 'ComparisonKing',
        authorId: 3,
        date: '2023-06-25',
        tags: ['comparison', 'smart home', 'review'],
        image: '/post-images/comparison.jpg'
      },
      {
        id: 4,
        title: 'Best Govee Products in 2023',
        content: 'My top picks for the best Govee products available this year...',
        author: 'ProductHunter',
        authorId: 4,
        date: '2023-07-01',
        tags: ['top picks', 'best of', '2023'],
        image: '/post-images/best-products.jpg'
      },
      {
        id: 5,
        title: 'Troubleshooting Govee Connection Issues',
        content: 'How to fix common connection problems with Govee devices...',
        author: 'TechSupport',
        authorId: 5,
        date: '2023-07-05',
        tags: ['troubleshooting', 'connection', 'help'],
        image: '/post-images/troubleshooting.jpg'
      }
    ]
  }),
  getters: {
    totalPages() {
      return Math.ceil(this.totalResults / this.pageSize);
    }
  },
  actions: {
    performSearch(query) {
      this.isLoading = true;
      this.searchQuery = query;

      // Simulate API call
      setTimeout(() => {
        // Search logic: match query in title, content, or tags
        const results = this.posts.filter(post => {
          const queryLower = query.toLowerCase();
          return (
            post.title.toLowerCase().includes(queryLower) ||
            post.content.toLowerCase().includes(queryLower) ||
            post.tags.some(tag => tag.toLowerCase().includes(queryLower))
          );
        });

        this.searchResults = results;
        this.totalResults = results.length;
        this.currentPage = 1; // Reset to first page on new search
        this.isLoading = false;
      }, 500);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
});