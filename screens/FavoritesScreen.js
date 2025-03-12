import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Modal } from 'react-native';
import FlashCard from '../components/FlashCard';
import FavoriteListItem from '../components/FavoriteListItem';
import { latinPhrases } from '../data';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { favorites, toggleFavorite, isDarkMode } = useContext(AppContext);
  const [favoriteCards, setFavoriteCards] = useState([]);
  
  // Dynamic theme colors
  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const headerBackgroundColor = isDarkMode ? '#1a1a1a' : 'white';
  const headerBorderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const modalBackgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const modalHeaderBg = isDarkMode ? '#1a1a1a' : 'white';
  const modalHeaderBorderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const secondaryTextColor = isDarkMode ? '#b0b0b0' : '#666666';
  const iconColor = isDarkMode ? '#64b5f6' : '#007bff';

  // Filter phrases to only include favorites
  useEffect(() => {
    const favoritePhrases = latinPhrases.filter(phrase => 
      favorites.includes(phrase.id)
    );
    setFavoriteCards(favoritePhrases);
  }, [favorites]);

  const handleSelectPhrase = (phrase) => {
    setSelectedPhrase(phrase);
    setModalVisible(true);
  };

  const handleRemoveFavorite = (id) => {
    toggleFavorite(id);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPhrase(null);
  };

  const handleNext = () => {
    const currentIndex = favoriteCards.findIndex(p => p.id === selectedPhrase.id);
    if (currentIndex < favoriteCards.length - 1) {
      setSelectedPhrase(favoriteCards[currentIndex + 1]);
    } else {
      // Loop back to the beginning
      setSelectedPhrase(favoriteCards[0]);
    }
  };
  
  const handlePrev = () => {
    const currentIndex = favoriteCards.findIndex(p => p.id === selectedPhrase.id);
    if (currentIndex > 0) {
      setSelectedPhrase(favoriteCards[currentIndex - 1]);
    } else {
      // Go to the last card
      setSelectedPhrase(favoriteCards[favoriteCards.length - 1]);
    }
  };

  if (favoriteCards.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor }]}>
        <Text style={[styles.emptyText, { color: textColor }]}>
          No favorites yet
        </Text>
        <Text style={[styles.emptySubText, { color: secondaryTextColor }]}>
          Tap the heart icon on phrases you want to save
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: headerBackgroundColor, borderBottomColor: headerBorderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Latin Learner - Favorites</Text>
      </View>
      
      <FlatList
        data={favoriteCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteListItem
            phrase={item}
            onPress={handleSelectPhrase}
            onRemove={handleRemoveFavorite}
            isDarkMode={isDarkMode}
          />
        )}
      />

      {/* Modal for displaying the selected phrase as a flashcard */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalContainer, { backgroundColor: modalBackgroundColor }]}>
          <View style={[styles.modalHeader, { backgroundColor: modalHeaderBg, borderBottomColor: modalHeaderBorderColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Flashcard</Text>
            <Ionicons 
              name="close" 
              size={28} 
              color={iconColor} 
              onPress={handleCloseModal}
              style={styles.closeButton}
            />
          </View>
          {selectedPhrase && (
            <FlashCard 
              phrase={selectedPhrase}
              onNext={handleNext}
              onPrev={handlePrev}
              hideNavigation={true}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  }
});
