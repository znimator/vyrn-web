<template>
  <div class="game-store">
    <header>
      <h1>Vyrn</h1>

      <div class="search-container">
        <input v-model="searchQuery" placeholder="Search games..." />
        <select v-model="selectedGenre">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre">{{ genre }}</option>
        </select>
        <select v-model="selectedPlatform">
          <option value="">All Platforms</option>
          <option v-for="platform in platforms" :key="platform">{{ platform }}</option>
        </select>
      </div>
    </header>

    <div class="game-grid">
      <div v-for="game in filteredGames" :key="game.id" class="game-card" @click="addToCart(game)">
        <!-- Discount badge -->
        <div v-if="game.discountPercentage" class="discount-badge">
          -{{ game.discountPercentage }}%
        </div>

        <div class="game-image">
          <img :src="game.imageUrl" :alt="game.title" />
        </div>

        <div class="game-info">
          <h3>{{ game.title }}</h3>

          <div class="game-details">
            <div class="price-container">
              <span v-if="game.discountPercentage" class="original-price">
                ${{ game.originalPrice.toFixed(2) }}
              </span>
              <span class="current-price" :class="{ 'free': isFree(game) }">
                {{ formattedPrice(game) }}
              </span>
            </div>

            <div class="tags">
              <span class="genres">{{ formattedGenres(game.genres) }}</span>
              <span class="platform">{{ game.platform }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="cartItems.length > 0" class="cart-sidebar">
      <h2>Your Cart ({{ cartItems.length }})</h2>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.title }} - ${{ item.originalPrice }}
          <button @click="removeFromCart(item.id)">×</button>
        </li>
      </ul>
      <div class="total">Total: ${{ cartTotal }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import GameService from '@/services/GameService';
import type { Game } from '@/types';

export default defineComponent({
  name: 'GameStore',
  setup() {
    const searchQuery = ref('');
    const selectedGenre = ref('');
    const selectedPlatform = ref('');
    const cartItems = ref<Game[]>([]);

    const formattedGenres = (genres: string[]) => {
      return genres.join(', ');
    };

    const formattedPrice = (game: Game) => {
      const price = game.discountPercentage
        ? game.originalPrice * (1 - game.discountPercentage / 100)
        : game.originalPrice;

      if (price <= 0) return "Free";
      return `$${price.toFixed(2)}`;
    };

    const isFree = (game: Game) => {
      const price = game.discountPercentage
        ? game.originalPrice * (1 - game.discountPercentage / 100)
        : game.originalPrice;
      return price <= 0;
    };

    const discountedPrice = (game: Game) => {
      if (game.discountPercentage) {
        return (game.originalPrice * (1 - game.discountPercentage / 100)).toFixed(2);
      }
      return game.originalPrice.toFixed(2);
    };

    // TODO:
    // Mock data - replace with API call
    const games = ref<Game[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    console.log(GameService.getGames())

    onMounted(async () => {
      try {
        games.value = await GameService.getGames();
      } catch (err) {
        error.value = 'Failed to load games. Please try again later.';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    });

    const genres = computed(() => {
      const allGenres = games.value.flatMap(game => game.genres);
      return [...new Set(allGenres)].sort();
    });
    const platforms = computed(() => [...new Set(games.value.map(g => g.platform))]);

    const filteredGames = computed(() => {
      return games.value.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesGenre = !selectedGenre.value || game.genres.includes(selectedGenre.value);
        const matchesPlatform = !selectedPlatform.value || game.platform === selectedPlatform.value;

        return matchesSearch && matchesGenre && matchesPlatform;
      });
    });

    const cartTotal = computed(() =>
      cartItems.value.reduce((sum, item) => sum + item.originalPrice * (item.discountPercentage ?? 0), 0).toFixed(2)
    );

    const addToCart = (game: Game) => {
      if (!cartItems.value.find(item => item.id === game.id)) {
        cartItems.value.push({ ...game });
      }
    };

    const removeFromCart = (id: number) => {
      cartItems.value = cartItems.value.filter(item => item.id !== id);
    };

    return {
      searchQuery,
      selectedGenre,
      selectedPlatform,
      cartItems,
      games,
      genres,
      platforms,
      filteredGames,
      formattedGenres,
      cartTotal,
      addToCart,
      removeFromCart,
      discountedPrice,
      formattedPrice,
      isFree
    };
  }
});
</script>

<style scoped>
/* Modern background and font */
.game-store {
  background: #f8f9fa;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

/* Hover animation */
.game-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease;
  transform-origin: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.game-card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* Text formatting */
.genres::after {
  content: " • ";
  margin: 0 4px;
  color: #666;
}

.tags {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9em;
}

.price {
  font-weight: 600;
  color: #2563eb;
}

.game-info h3 {
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
}

/* Modern input styling */
.search-container input,
.search-container select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-family: inherit;
}

.search-container select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
}

.game-store {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.game-card {
  position: relative;
  border: 1px solid #2c3e50;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.game-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.game-info {
  padding: 1rem;
}

.cart-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: #1a1a1a;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #22c55e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.current-price.free {
  color: #3b82f6;
  /* Blue color for "Free" text */
  font-weight: 700;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-height: 24px;
  /* Prevent layout shift */
}

.original-price {
  text-decoration: line-through;
  color: #6b7280;
  font-size: 0.9em;
}

.current-price {
  color: #22c55e;
  font-weight: 600;
  font-size: 1.1em;
}

/* Add more styles as needed */
</style>
