import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message: string;
}

export default function EmptyState({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, alignItems: 'center' },
  text: { color: '#777', fontSize: 16 },
});
