import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface Props {
  size?: number | 'small' | 'large';
  color?: string;
}

export default function Loading({ size = 'large', color = '#7b4bcb' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
});
