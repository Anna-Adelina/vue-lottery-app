<script setup lang="ts">
const REPO_URL = 'https://github.com/Anna-Adelina/vue-lottery-app'

const technologies: string[] = [
  'Vue 3 (Composition API)',
  'TypeScript',
  'Vue Router',
  'Vite',
  'SCSS',
  'ESLint',
]
</script>

<template>
  <section>
    <h1>Vue Lottery</h1>
    <p>
      Застосунок для проведення лотереї: реєстрація учасників, пошук і сортування списку,
      випадковий вибір переможців.
    </p>

    <h2>Технології</h2>
    <ul>
      <li v-for="tech in technologies" :key="tech">{{ tech }}</li>
    </ul>

    <a :href="REPO_URL" target="_blank" rel="noopener noreferrer">Код проєкту на GitHub</a>
  </section>
</template>