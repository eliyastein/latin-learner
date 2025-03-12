import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { removeCitationRefs } from '../utils/textUtils';

export default function FavoriteListItem({ phrase, onPress, onRemove, isDarkMode }) {
  // Dynamic theme colors
  const backgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const secondaryTextColor = isDarkMode ? '#b0b0b0' : '#666666';
  const shadowStyle = isDarkMode ? 
    { shadowColor: '#000', shadowOpacity: 0.4 } : 
    { shadowColor: '#000', shadowOpacity: 0.2 };

  // Clean the text of citation references
  const cleanLatin = removeCitationRefs(phrase.latin);
  const cleanEnglish = removeCitationRefs(phrase.english);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }, shadowStyle]} 
      onPress={() => onPress(phrase)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.latinText, { color: textColor }]}>
          {cleanLatin.toUpperCase()}
        </Text>
        <Text style={[styles.englishText, { color: secondaryTextColor }]}>{cleanEnglish}</Text>
      </View>
      {onRemove && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove(phrase.id)}
        >
          <Ionicons name="heart" size={24} color="#ff4081" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  latinText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    letterSpacing: 0.5,
  },
  englishText: {
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
});
