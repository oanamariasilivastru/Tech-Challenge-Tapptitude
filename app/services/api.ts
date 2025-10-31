import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../models/Recipe';

const API_URL = 'http://localhost:3000/api';

export interface ApiResponse<T> {
  error?: string;
  message?: string;
  token?: string;
  recipes?: T[];
}

export async function register(email: string, password: string): Promise<ApiResponse<any>> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) await AsyncStorage.setItem('token', data.token);
  return data;
}

export async function login(email: string, password: string): Promise<ApiResponse<any>> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) await AsyncStorage.setItem('token', data.token);
  return data;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('token');
}

async function getToken(): Promise<string> {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return token;
}

export async function getRecipes(): Promise<ApiResponse<Recipe>> {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
}

export async function addFavorite(recipeId: string): Promise<ApiResponse<any>> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function removeFavorite(recipeId: string): Promise<ApiResponse<any>> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function likeRecipe(recipeId: string): Promise<ApiResponse<any>> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/recipes/${recipeId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function dislikeRecipe(recipeId: string): Promise<ApiResponse<any>> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/recipes/${recipeId}/dislike`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function fetchAIRecipes(prompt: string): Promise<ApiResponse<Recipe>> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/ai/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}
export { Recipe };

