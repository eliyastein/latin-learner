import React, { useState, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { parseLatinPhrase, removeCitationRefs } from '../utils/textUtils';

export default function FlashCard({ phrase, onNext, onPrev, hideNavigation = false }) {
  const { favorites, toggleFavorite, isDarkMode } = useContext(AppContext);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Parse the Latin phrase using our utility function
  const { mainText, pronunciationText } = parseLatinPhrase(phrase);

  // Clean the English translation and notes of citation references
  const cleanEnglish = removeCitationRefs(phrase.english);
  const cleanNotes = phrase.notes ? removeCitationRefs(phrase.notes) : '';

  // Interpolate rotation values for front and back sides
  const frontRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const backRotate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 0, 0, 0]
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1]
  });

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;

    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();

    setIsFlipped(!isFlipped);
  };

  const isFavorite = favorites?.includes(phrase.id) || false;

  // Define theme-based colors
  const backgroundColor = isDarkMode ? '#1e1e1e' : '#fff';
  const cardBackgroundColor = isDarkMode ? '#2d2d2d' : '#f8f8f8';
  const textColor = isDarkMode ? '#f0f0f0' : '#333';
  const secondaryTextColor = isDarkMode ? '#bbb' : '#666';
  const hintBackground = isDarkMode ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={handleFlip}
        activeOpacity={1}
      >
        {/* Front card face */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor },
            {
              opacity: frontOpacity,
              transform: [
                { perspective: 1000 },
                { rotateY: frontRotate }
              ],
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.latinText, { color: textColor }]}>
              {mainText}
            </Text>
            <Text style={[styles.pronunciationText, { color: secondaryTextColor }]}>
              ({pronunciationText})
            </Text>
          </View>
          
          <View style={[styles.tapHintContainer, { backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(245, 245, 245, 0.7)' }]}>
            <Text style={[styles.tapHint, { backgroundColor: hintBackground, color: secondaryTextColor }]}>
              Tap to reveal translation
            </Text>
          </View>
        </Animated.View>

        {/* Back card face */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: cardBackgroundColor },
            {
              opacity: backOpacity,
              transform: [
                { perspective: 1000 },
                { rotateY: backRotate }
              ],
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.englishText, { color: textColor }]}>{cleanEnglish}</Text>
            <Text style={[styles.notes, { color: secondaryTextColor }]}>{cleanNotes}</Text>
          </View>
          
          <View style={[styles.tapHintContainer, { backgroundColor: isDarkMode ? 'rgba(45, 45, 45, 0.7)' : 'rgba(248, 248, 248, 0.7)' }]}>
            <Text style={[styles.tapHint, { backgroundColor: hintBackground, color: secondaryTextColor }]}>
              Tap to flip back
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <View style={styles.buttonContainer}>
          {!hideNavigation && (
            <TouchableOpacity style={styles.button} onPress={onPrev}>
              <Ionicons name="arrow-back" size={20} color="white" />
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.favoriteButton, hideNavigation && styles.centeredFavoriteButton]} 
            onPress={() => toggleFavorite && toggleFavorite(phrase.id)}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={28} 
              color={isFavorite ? "#ff4081" : "#007bff"} 
            />
          </TouchableOpacity>
          
          {!hideNavigation && (
            <TouchableOpacity style={styles.button} onPress={onNext}>
              <Text style={styles.buttonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: Dimensions.get('window').width - 40,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Add padding to ensure content doesn't overlap with hint
  },
  latinText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    letterSpacing: 1.5,
  },
  pronunciationText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  englishText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  notes: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  tapHintContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  tapHint: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  favoriteButton: {
    padding: 10,
  },
  centeredFavoriteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
