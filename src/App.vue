<!-- App.vue -->
<template>
  <div id="app">
    <GameStore />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GameStore from './components/GameStore.vue';

export default defineComponent({
  components: {
    GameStore
  }
});
</script>