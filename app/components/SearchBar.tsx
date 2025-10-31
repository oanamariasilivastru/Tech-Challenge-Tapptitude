import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  query: string;
  setQuery: (text: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ query, setQuery, onSearch }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#777" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.input}
        placeholder="Search recipes..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={onSearch}>
        <Ionicons name="arrow-forward" size={18} color="#777" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 40,
    marginBottom: 24,
    width: '85%',
    alignSelf: 'center',
  },
  input: { flex: 1, fontSize: 14, color: '#333' },
});
