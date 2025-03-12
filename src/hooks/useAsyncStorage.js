import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook to handle AsyncStorage operations
 * @param {string} key - Storage key
 * @param {any} initialValue - Default value if storage is empty
 * @returns {[any, Function, boolean, string]} - [value, setValue, loading, error]
 */
export const useAsyncStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const item = await AsyncStorage.getItem(key);
        setValue(item !== null ? JSON.parse(item) : initialValue);
      } catch (e) {
        setError(`Error loading data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, initialValue]);

  // Save data to storage
  const storeValue = useCallback(async (newValue) => {
    try {
      const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
      setValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      setError(`Error storing data: ${e.message}`);
    }
  }, [key, value]);

  return [value, storeValue, loading, error];
};
