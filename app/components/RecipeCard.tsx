import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../models/Recipe';

interface Props {
  recipe: Recipe;
  onPress?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}

export default function RecipeCard({ recipe, onPress, onLike, onDislike }: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={onPress}>
        <View style={styles.imagePlaceholder}>
          {recipe.image ? <Image source={{ uri: recipe.image }} style={styles.image} /> : <Ionicons name="image-outline" size={24} color="#bbb" />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeTime}>{recipe.time ?? '20 min.'}</Text>
        </View>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onLike} style={{ marginRight: 10 }}>
          <Ionicons name="thumbs-up" size={22} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDislike}>
          <Ionicons name="thumbs-down" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    width: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: { width: 50, height: 50, borderRadius: 8 },
  recipeTitle: { fontSize: 14, fontWeight: '600', color: '#222' },
  recipeTime: { fontSize: 12, color: '#777' },
});
