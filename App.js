import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, AppContext } from './context/AppContext';
import AllPhrasesScreen from './screens/AllPhrasesScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';

// Inner component to access context
function MainApp() {
  const [activeTab, setActiveTab] = React.useState('all');
  const { isDarkMode, isLoading } = useContext(AppContext);
  
  // Dynamic theme colors
  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const tabBarColor = isDarkMode ? '#1a1a1a' : '#ffffff';
  const tabBorderColor = isDarkMode ? '#333333' : '#dddddd';
  const inactiveIconColor = isDarkMode ? '#888888' : '#777777';
  const activeIconColor = '#007bff';
  const statusBarStyle = isDarkMode ? 'light' : 'dark';
  
  // Display loading indicator until AsyncStorage data is loaded
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={activeIconColor} />
        <Text style={{ color: isDarkMode ? '#ffffff' : '#333333', marginTop: 20 }}>
          Loading Latin Learner...
        </Text>
      </View>
    );
  }
  
  const renderScreen = () => {
    switch (activeTab) {
      case 'search':
        return <SearchScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <AllPhrasesScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {renderScreen()}
      
      <View style={[
        styles.tabBar, 
        { 
          backgroundColor: tabBarColor, 
          borderTopColor: tabBorderColor 
        }
      ]}>
        <TabButton 
          active={activeTab === 'all'} 
          onPress={() => setActiveTab('all')}
          iconName="book"
          label="Phrases"
          activeIconColor={activeIconColor}
          inactiveIconColor={inactiveIconColor}
        />
        
        <TabButton 
          active={activeTab === 'search'} 
          onPress={() => setActiveTab('search')}
          iconName="search"
          label="Search"
          activeIconColor={activeIconColor}
          inactiveIconColor={inactiveIconColor}
        />
        
        <TabButton 
          active={activeTab === 'favorites'} 
          onPress={() => setActiveTab('favorites')}
          iconName="heart"
          label="Favorites"
          activeIconColor={activeIconColor}
          inactiveIconColor={inactiveIconColor}
        />
        
        <TabButton 
          active={activeTab === 'settings'} 
          onPress={() => setActiveTab('settings')}
          iconName="settings"
          label="Settings"
          activeIconColor={activeIconColor}
          inactiveIconColor={inactiveIconColor}
        />
      </View>
      
      <StatusBar style={statusBarStyle} />
    </SafeAreaView>
  );
}

// Extract TabButton as a component for cleaner code
function TabButton({ active, onPress, iconName, label, activeIconColor, inactiveIconColor }) {
  return (
    <TouchableOpacity 
      style={[styles.tab, active && styles.activeTab]} 
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Ionicons 
        name={iconName} 
        size={24} 
        color={active ? activeIconColor : inactiveIconColor} 
      />
      <Text style={[
        styles.tabText, 
        { color: active ? activeIconColor : inactiveIconColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Wrapper component with provider
export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#007bff',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
  },
});
