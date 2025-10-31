import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getRecipes, fetchAIRecipes, likeRecipe, dislikeRecipe } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { Recipe } from '../models/Recipe';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: NavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecipes = async (prompt?: string) => {
    setLoading(true);
    try {
      const data = prompt?.trim() ? await fetchAIRecipes(prompt) : await getRecipes();
      setRecipes((data.recipes || []).map(r => ({
        ...r,
        image: r.image || '',
        time: r.time || '20 min.',
        isFavorite: r.isFavorite || false
      })));
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleLike = async (id: string) => {
    await likeRecipe(id);
    loadRecipes(query);
  };

  const handleDislike = async (id: string) => {
    await dislikeRecipe(id);
    loadRecipes(query);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fafafa', paddingTop: 60 }}>
      <SearchBar query={query} setQuery={setQuery} onSearch={() => loadRecipes(query)} />
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 16, alignSelf: 'center' }}>Recipes</Text>
      {loading ? (
        <Loading />
      ) : recipes.length === 0 ? (
        <EmptyState message="No recipes found 😔" />
      ) : (
        recipes.map(r => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: r.id })}
            onLike={() => handleLike(r.id)}
            onDislike={() => handleDislike(r.id)}
          />
        ))
      )}
    </ScrollView>
  );
}
