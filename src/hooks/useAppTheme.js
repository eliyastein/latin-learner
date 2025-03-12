import { useContext } from 'react';
import { getColors, typography, spacing, layout } from '../theme/theme';
import { AppContext } from '../context/AppContext';

/**
 * Custom hook to access theme across the app
 * Returns colors, typography, spacing, and layout based on current theme setting
 */
export const useAppTheme = () => {
  const { isDarkMode } = useContext(AppContext);
  
  return {
    colors: getColors(isDarkMode),
    typography,
    spacing,
    layout,
    isDarkMode,
  };
};
