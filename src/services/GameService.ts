/* eslint-disable  @typescript-eslint/no-explicit-any */

import type { Game } from '@/types'
import axios from 'axios'

const API_SERVER = 'http://localhost:3001'
const API_BASE = `${API_SERVER}/api`

export default {
  async getGames(): Promise<Game[]> {
    const response = await axios.get(`${API_BASE}/games`)
    return response.data.map((dbGame: any) => ({
      id: dbGame.id,
      title: dbGame.title,
      originalPrice: dbGame.original_price,
      discountPercentage: dbGame.discount_percentage,
      genres: dbGame.genres.split(', '),
      platform: dbGame.platform,
      imageUrl: `${API_SERVER}${dbGame.image_url}`,
    }))
  },
}
