/**
 * Application theme definitions
 */

export const getColors = (isDarkMode) => ({
  // Background colors
  background: isDarkMode ? '#121212' : '#f5f5f5',
  card: isDarkMode ? '#1e1e1e' : '#ffffff',
  cardAlt: isDarkMode ? '#2d2d2d' : '#f8f8f8',
  modalBackground: isDarkMode ? '#121212' : '#f5f5f5', 
  headerBackground: isDarkMode ? '#1a1a1a' : 'white',
  
  // Text colors
  text: isDarkMode ? '#f0f0f0' : '#333333',
  textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
  
  // UI elements
  tabBar: isDarkMode ? '#1a1a1a' : '#ffffff',
  border: isDarkMode ? '#333333' : '#dddddd',
  hintOverlay: isDarkMode ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  shadow: '#000000',
  radio: {
    inactive: isDarkMode ? '#555555' : '#dddddd',
  },
  
  // Interactive elements
  primary: '#007bff',
  accent: '#2196F3',
  favorite: '#ff4081',
  
  // Icons
  iconActive: '#007bff',
  iconInactive: isDarkMode ? '#888888' : '#777777',
  iconSun: '#ffa000',
  iconMoon: '#ffca28',
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const typography = {
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  large: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
  small: {
    fontSize: 12,
  },
};

export const layout = {
  borderRadius: {
    sm: 5,
    md: 8,
    lg: 10,
    xl: 15,
  },
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  }
};
