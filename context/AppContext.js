import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load preferences from storage on app start
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        
        // Load preferences in parallel for better performance
        const [storedFavorites, theme] = await Promise.all([
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('isDarkMode'),
        ]);
        
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        
        setIsDarkMode(theme === 'true');
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        // Always set loading to false even if there's an error
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Save favorites to storage when they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };
    
    if (favorites.length > 0) {
      saveFavorites();
    }
  }, [favorites]);
  
  const toggleFavorite = (id) => {
    setFavorites(current => {
      if (current.includes(id)) {
        return current.filter(favId => favId !== id);
      } else {
        return [...current, id];
      }
    });
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      AsyncStorage.setItem('isDarkMode', newValue.toString());
      return newValue;
    });
  };
  
  return (
    <AppContext.Provider value={{
      favorites,
      toggleFavorite,
      isDarkMode,
      toggleDarkMode,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
