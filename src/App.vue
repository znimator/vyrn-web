<!-- src/App.vue -->
<template>
  <div id="app">
    <NavBar />
    <router-view class="main-content" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from '@/components/NavBar.vue';

export default defineComponent({
  components: { NavBar }
});
</script>

<style>
#app {
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style>
