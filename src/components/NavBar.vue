<!-- src/components/NavBar.vue -->
<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link v-for="link in links" :key="link.path" :to="link.path" class="nav-link"
        :class="{ 'active': $route.path === link.path }">
        {{ link.name }}
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

interface NavLink {
  name: string;
  path: RouteLocationRaw;
}

export default defineComponent({
  name: 'NavBar',
  setup() {
    const links: NavLink[] = [
      { name: 'Store', path: '/store' },
      { name: 'Library', path: '/library' },
      { name: 'Profile', path: '/profile' },
      { name: 'About', path: '/about' }
    ];

    return { links };
  }
});
</script>

<style scoped>
.navbar {
  background: #1a1a1a;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: #00dc82;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: #00dc82;
}
</style>
