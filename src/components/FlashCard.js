import React, { useState, useRef, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useAppTheme } from '../hooks/useAppTheme';
import { ANIMATION } from '../constants';

const { width } = Dimensions.get('window');

function FlashCard({ phrase, onNext, onPrev }) {
  const { favorites, toggleFavorite } = useContext(AppContext);
  const { colors, typography, spacing, layout } = useAppTheme();
  
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Memoize animation configurations
  const animations = useMemo(() => ({
    frontRotate: flipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    }),
    backRotate: flipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg']
    }),
    frontOpacity: flipAnimation.interpolate({
      inputRange: [0, 0.5, 0.5, 1],
      outputRange: [1, 0, 0, 0]
    }),
    backOpacity: flipAnimation.interpolate({
      inputRange: [0, 0.5, 0.5, 1],
      outputRange: [0, 0, 1, 1]
    })
  }), [flipAnimation]);

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;

    Animated.timing(flipAnimation, {
      toValue,
      duration: ANIMATION.FLIP_DURATION,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();

    setIsFlipped(!isFlipped);
  };

  const isFavorite = favorites?.includes(phrase.id) || false;

  // Card styles with theme colors
  const styles = useMemo(() => createStyles(colors, spacing, layout), [colors, spacing, layout]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={handleFlip}
        activeOpacity={1}
        accessible={true}
        accessibilityLabel={`${phrase.latin} flashcard. Tap to flip.`}
        accessibilityHint="Tap to see the translation"
        accessibilityRole="button"
      >
        {/* Front card face */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.card },
            {
              opacity: animations.frontOpacity,
              transform: [
                { perspective: 1000 },
                { rotateY: animations.frontRotate }
              ],
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        >
          <Text style={[typography.heading1, { color: colors.text }]}>{phrase.latin}</Text>
          <Text style={[typography.body, styles.pronunciation, { color: colors.textSecondary }]}>
            {phrase.pronunciation || '(' + phrase.latin.toLowerCase() + ')'}
          </Text>
          
          <View style={styles.tapHintContainer}>
            <Text style={[
              typography.caption, 
              styles.tapHint, 
              { 
                backgroundColor: colors.hintOverlay, 
                color: colors.textSecondary 
              }
            ]}>
              Tap to reveal translation
            </Text>
          </View>
        </Animated.View>

        {/* Back card face */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.cardAlt },
            {
              opacity: animations.backOpacity,
              transform: [
                { perspective: 1000 },
                { rotateY: animations.backRotate }
              ],
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        >
          <Text style={[typography.large, styles.englishText, { color: colors.text }]}>
            {phrase.english}
          </Text>
          <Text style={[typography.body, styles.notes, { color: colors.textSecondary }]}>
            {phrase.notes}
          </Text>
          <View style={styles.tapHintContainer}>
            <Text style={[
              typography.caption, 
              styles.tapHint, 
              { 
                backgroundColor: colors.hintOverlay, 
                color: colors.textSecondary 
              }
            ]}>
              Tap to flip back
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={onPrev}
            accessible={true}
            accessibilityLabel="Previous phrase"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => toggleFavorite(phrase.id)}
            accessible={true}
            accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            accessibilityRole="button"
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={28} 
              color={isFavorite ? colors.favorite : colors.primary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={onNext}
            accessible={true}
            accessibilityLabel="Next phrase"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

FlashCard.propTypes = {
  phrase: PropTypes.shape({
    id: PropTypes.string.isRequired,
    latin: PropTypes.string.isRequired,
    english: PropTypes.string.isRequired,
    notes: PropTypes.string,
    pronunciation: PropTypes.string,
  }).isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

const createStyles = (colors, spacing, layout) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: width - spacing.xl * 2,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    ...layout.shadow.medium,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    width: '100%',
    height: '100%',
  },
  pronunciation: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  englishText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  notes: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  tapHintContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  tapHint: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius.xl,
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
    width: width - spacing.xl * 2,
    marginTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - spacing.xs,
    paddingHorizontal: spacing.md - spacing.xs / 2,
    borderRadius: layout.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: spacing.xs,
  },
  favoriteButton: {
    padding: spacing.md,
  }
});

export default React.memo(FlashCard);
