import React, { useContext } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useContext(AppContext);
  
  // Dynamic theme colors based on dark mode
  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const cardBackgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const secondaryTextColor = isDarkMode ? '#b0b0b0' : '#666666';
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>
      
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        {/* Dark mode setting */}
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={22} 
              color={isDarkMode ? "#ffca28" : "#ffa000"} 
              style={styles.settingIcon}
            />
            <View>
              <Text style={[styles.settingTitle, { color: textColor }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                Switch to {isDarkMode ? "light" : "dark"} theme
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#2196F3" }}
            thumbColor={isDarkMode ? "#ffffff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>
      </View>
      
      <Text style={[styles.appInfo, { color: secondaryTextColor }]}>
        Latin Learner v1.0.0 - Vibe coded with ❤️ by @prettyblocks
      </Text>
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
    marginBottom: 20,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 14,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  appInfo: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  }
});
