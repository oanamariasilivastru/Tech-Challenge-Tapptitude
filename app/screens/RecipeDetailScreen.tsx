import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Recipe, getRecipes } from '../services/api';

type DetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

interface Props {
  route: DetailRouteProp;
}

const RecipeDetailScreen: React.FC<Props> = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipes();
        const found = data.recipes?.find(r => r.id === recipeId) || null;
        setRecipe(found);
        setIsFavorite(found?.isFavorite || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  if (loading) return <ActivityIndicator size="large" color="#7b4bcb" style={{ flex: 1, justifyContent: 'center' }} />;

  if (!recipe) return (
    <View style={styles.center}>
      <Text>Recipe not found</Text>
    </View>
  );

  const isSmallScreen = screenWidth < 600;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.mainRow, { flexDirection: isSmallScreen ? 'column' : 'row' }]}>
        <View style={styles.leftColumn}>
          {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{recipe.title}</Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="#7b4bcb" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.rightColumn} nestedScrollEnabled>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients?.map((ing, i) => (
            <Text key={i} style={styles.listItem}>• {ing}</Text>
          ))}
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions?.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainRow: {
    flexWrap: 'wrap',
  },
  leftColumn: {
    flex: 1,
    minWidth: 200,
    marginRight: 16,
  },
  rightColumn: {
    flex: 2,
    minWidth: 200,
    maxHeight: 400,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginVertical: 8,
  },
  listItem: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7b4bcb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default RecipeDetailScreen;
