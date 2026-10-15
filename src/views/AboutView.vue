<script setup lang="ts">
const FULL_NAME = 'Бурковська Анна-Аделіна Дмитрівна'
const GITHUB_URL = 'https://github.com/Anna-Adelina/vue-lottery-app.git'

const skills: string[] = ['Java', 'Spring Boot', 'SQL', 'TypeScript', 'Vue 3', 'Git']
</script>

<template>
  <section>
    <h1>About author</h1>
    <p>{{ FULL_NAME }}</p>

    <h2>Technical skills</h2>
    <ul>
      <li v-for="skill in skills" :key="skill">{{ skill }}</li>
    </ul>

    <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer">GitHub</a>
  </section>
</template>