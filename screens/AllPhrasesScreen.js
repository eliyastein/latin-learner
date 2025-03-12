import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlashCard from '../components/FlashCard';
import { latinPhrases } from '../data';
import { AppContext } from '../context/AppContext';

export default function AllPhrasesScreen() {
  const { isDarkMode } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Add card history for proper back navigation
  const [cardHistory, setCardHistory] = useState([]);

  // Dynamic theme colors
  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const headerBackgroundColor = isDarkMode ? '#1a1a1a' : 'white';
  const textColor = isDarkMode ? '#ffffff' : '#333333';

  // Set a random starting card when component loads
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * latinPhrases.length);
    setCurrentIndex(randomIndex);
    setCardHistory([randomIndex]);
  }, []);
  
  const handleNext = () => {
    // Pick a random card that's not the current one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * latinPhrases.length);
    } while (randomIndex === currentIndex && latinPhrases.length > 1);
    
    setCurrentIndex(randomIndex);
    
    // Update history - add new card to history
    setCardHistory(prevHistory => [...prevHistory, randomIndex]);
  };
  
  const handlePrev = () => {
    // Only go back if we have history
    if (cardHistory.length > 1) {
      // Remove current card from history
      const newHistory = [...cardHistory];
      newHistory.pop();
      
      // Set the index to the previous card
      const prevIndex = newHistory[newHistory.length - 1];
      setCurrentIndex(prevIndex);
      setCardHistory(newHistory);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Latin Learner</Text>
      </View>
      
      <FlashCard 
        phrase={latinPhrases[currentIndex]}
        onNext={handleNext}
        onPrev={handlePrev}
      />
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
});
