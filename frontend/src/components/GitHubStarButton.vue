<template>
  <a 
    :href="repo" 
    target="_blank" 
    rel="noopener noreferrer" 
    class="github-star-button"
    :title="`Star ${repoName} on GitHub`"
  >
    <svg class="star-icon" viewBox="0 0 16 16" width="16" height="16">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
    </svg>
    <span class="button-text">Star</span>
    <span v-if="starCount !== null" class="star-count">{{ formatCount(starCount) }}</span>
  </a>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  repo: {
    type: String,
    required: true
  }
})

const starCount = ref(null)
const loading = ref(true)
const repoName = props.repo.replace('https://github.com/', '')

const formatCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

onMounted(async () => {
  try {
    console.log('Fetching star count for:', repoName)
    const response = await fetch(`https://api.github.com/repos/${repoName}`)
    console.log('Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      starCount.value = data.stargazers_count
      console.log('Star count:', starCount.value)
    } else {
      console.warn('GitHub API response not OK:', response.status)
    }
  } catch (error) {
    console.warn('Failed to fetch star count:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.github-star-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
  height: 28px;
}

.github-star-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.star-icon {
  fill: currentColor;
  flex-shrink: 0;
}

.button-text {
  font-weight: 600;
}

.star-count {
  padding: 0 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.2rem;
}

@media (max-width: 640px) {
  .button-text {
    display: none;
  }
}
</style>
