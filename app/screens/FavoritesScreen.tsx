import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRecipes, addFavorite, removeFavorite, dislikeRecipe } from '../services/api';
import { Recipe } from '../models/Recipe';

export default function FavoritesScreen({ navigation }: any) {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getRecipes();
      if (data.recipes) {
        const favs = data.recipes.filter(r => r.isFavorite).map((r) => ({
          ...r,
          image: r.image || '',
        }));
        setFavorites(favs);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error(err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    const unsubscribe = navigation.addListener('focus', fetchFavorites);
    return unsubscribe;
  }, [navigation]);

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    try {
      if (isFav) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
      setFavorites(prev =>
        prev.map(r => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not update favorite');
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await dislikeRecipe(id);
      setFavorites(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not dislike recipe');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {loading ? (
        <Text style={styles.empty}>Loading...</Text>
      ) : favorites.length === 0 ? (
        <Text style={styles.empty}>No favorites yet ❤️</Text>
      ) : (
        favorites.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={28} color="#bbb" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeTime}>{item.time || '20 min.'}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => handleToggleFavorite(item.id, item.isFavorite)}
                style={{ marginRight: 12 }}
              >
                <Ionicons
                  name={item.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color="red"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDislike(item.id)}>
                <Ionicons name="thumbs-down" size={22} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 16, alignSelf: 'center', width: '90%' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    width: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#e5e5e5', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  recipeTitle: { fontSize: 14, fontWeight: '600', color: '#222' },
  recipeTime: { fontSize: 12, color: '#777' },
  empty: { textAlign: 'center', marginTop: 40, color: 'gray', fontSize: 16 },
});
