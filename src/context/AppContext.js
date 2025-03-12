import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { STORAGE_KEYS } from '../constants';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Use our custom hook to manage state with AsyncStorage
  const [favorites, setFavorites] = useAsyncStorage(STORAGE_KEYS.FAVORITES, []);
  const [isDarkMode, setIsDarkMode] = useAsyncStorage(STORAGE_KEYS.DARK_MODE, false);
  const [isListView, setIsListView] = useAsyncStorage(STORAGE_KEYS.LIST_VIEW, false);
  
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
    setIsDarkMode(prev => !prev);
  };
  
  const toggleListView = () => {
    setIsListView(prev => !prev);
  };
  
  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
    favorites,
    toggleFavorite,
    isDarkMode,
    toggleDarkMode,
    isListView,
    toggleListView
  }), [favorites, isDarkMode, isListView]);
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
