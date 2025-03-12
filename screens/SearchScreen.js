import React, { useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Modal, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import FlashCard from '../components/FlashCard';
import FavoriteListItem from '../components/FavoriteListItem';
import { latinPhrases } from '../data';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const { isDarkMode } = useContext(AppContext);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhrases, setFilteredPhrases] = useState(latinPhrases);
  
  // Dynamic theme colors
  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const headerBackgroundColor = isDarkMode ? '#1a1a1a' : 'white';
  const headerBorderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const secondaryTextColor = isDarkMode ? '#b0b0b0' : '#666666';
  const placeholderTextColor = isDarkMode ? '#888888' : '#999999';
  const searchBgColor = isDarkMode ? '#2a2a2a' : '#ffffff';
  const searchBorderColor = isDarkMode ? '#444444' : '#dddddd';
  const modalBackgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const modalHeaderBg = isDarkMode ? '#1a1a1a' : 'white';
  const modalHeaderBorderColor = isDarkMode ? '#333333' : '#e0e0e0';
  const iconColor = isDarkMode ? '#64b5f6' : '#007bff';

  // Filter phrases based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPhrases(latinPhrases);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = latinPhrases.filter(phrase => 
        phrase.latin.toLowerCase().includes(query) || 
        phrase.english.toLowerCase().includes(query) ||
        (phrase.notes && phrase.notes.toLowerCase().includes(query))
      );
      setFilteredPhrases(filtered);
    }
  }, [searchQuery]);

  // List view handlers
  const handleSelectPhrase = (phrase) => {
    setSelectedPhrase(phrase);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPhrase(null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[
        styles.header, 
        { backgroundColor: headerBackgroundColor, borderBottomWidth: 1, borderBottomColor: headerBorderColor }
      ]}>
        <Text style={[styles.title, { color: textColor }]}>Search Latin Phrases</Text>
        
        <View style={[
          styles.searchContainer, 
          { 
            backgroundColor: searchBgColor, 
            borderColor: searchBorderColor 
          }
        ]}>
          <Ionicons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search Latin phrases..."
            placeholderTextColor={placeholderTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={secondaryTextColor} style={styles.clearButton} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredPhrases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteListItem
            phrase={item}
            onPress={handleSelectPhrase}
            onRemove={null}  // No remove function in the search list
            isDarkMode={isDarkMode}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: textColor }]}>No phrases found</Text>
            <Text style={[styles.emptySubText, { color: secondaryTextColor }]}>
              Try a different search term
            </Text>
          </View>
        }
      />
      
      {/* Modal for displaying selected phrase as a flashcard */}
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
              onNext={() => {}}  // Not needed in modal view
              onPrev={() => {}}  // Not needed in modal view
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
    paddingTop: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
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
