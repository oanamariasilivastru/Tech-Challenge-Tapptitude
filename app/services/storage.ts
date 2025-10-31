import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../models/Recipe';

const FAVORITES_KEY = 'favorites';

export async function getFavorites(): Promise<Recipe[]> {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveFavorite(recipe: Recipe) {
  const favs = await getFavorites();
  const exists = favs.find((r) => r.id === recipe.id);
  if (!exists) {
    const updated = [...favs, recipe];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
}

export async function removeFavorite(id: string) {
  const favs = await getFavorites();
  const updated = favs.filter((r) => r.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}
