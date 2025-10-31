import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAIRecipes, Recipe, likeRecipe, dislikeRecipe } from "../services/api";

export default function RecipeListScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("something healthy for dinner");

  const loadRecipes = async (q: string) => {
    setLoading(true);
    try {
      const data = await fetchAIRecipes(q);
      if (data.recipes) {
        setRecipes(data.recipes.map(r => ({ ...r, isFavorite: false })));
      }
    } catch (err) {
      console.error("❌ Failed to load recipes:", err);
      Alert.alert("Error", "Could not fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes(query);
  }, []);

  const handleSearch = () => {
    Keyboard.dismiss();
    loadRecipes(query);
  };

  const toggleFavorite = async (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    try {
      if (!recipe.isFavorite) {
        await likeRecipe(id);
      }
      setRecipes(prev =>
        prev.map(r => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update favorite");
    }
  };

  const handleDislike = async (id: string) => {
    try {
      await dislikeRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not dislike recipe");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search recipes..."
          placeholderTextColor="#888"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Suggested recipes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7b4bcb" style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={recipes}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image || "https://placehold.co/100x100" }}
                  style={styles.image}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <Text style={styles.ingredientsPreview}>
                    {item.ingredients?.slice(0, 3).join(", ")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ marginRight: 12 }}>
                    <Ionicons
                      name={item.isFavorite ? "heart" : "heart-outline"}
                      size={22}
                      color="red"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDislike(item.id)}>
                    <Ionicons name="thumbs-down" size={22} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.bottomButton} onPress={() => loadRecipes(query)}>
            <Text style={styles.bottomButtonText}>I don’t like these</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", alignItems: "center", paddingTop: 60 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 40,
    marginBottom: 24,
    width: "85%",
    maxWidth: 360,
    justifyContent: "space-between",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333", marginRight: 8 },
  header: { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 16, width: "85%", maxWidth: 360, alignSelf: "center" },
  listContainer: { alignItems: "center", paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    width: "85%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  recipeTitle: { fontSize: 14, fontWeight: "600", color: "#222" },
  ingredientsPreview: { fontSize: 12, color: "#777", marginTop: 2 },
  bottomButton: {
    backgroundColor: "#7b4bcb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 22,
    alignSelf: "center",
    marginTop: 20,
    width: "85%",
    maxWidth: 360,
  },
  bottomButtonText: { color: "#fff", fontWeight: "700", fontSize: 14, textAlign: "center" },
});
