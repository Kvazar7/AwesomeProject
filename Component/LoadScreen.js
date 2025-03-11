import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadScreen = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#FF6C00" />
      <Text style={styles.text}>Зачекайте будь ласка...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF6C00',
  },
});

export default LoadScreen;