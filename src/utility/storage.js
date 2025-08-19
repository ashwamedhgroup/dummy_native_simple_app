import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = {
  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? value : null;
    } catch (error) {
      console.log(`Getting Error ${key}`, error);
      return null;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(`Error setting ${key}`, error);
    }
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(`Error Removing ${key}`, error);
    }
  },

  async multiRemove(keys) {
    try {
      if (!Array.isArray(keys)) {
        throw new Error("Keys must be provided as an array of strings.");
      }
      await AsyncStorage.multiRemove(keys);
      console.log("Keys removed successfully:", keys);
    } catch (error) {
      console.log("Error removing multiple keys:", error);
    }
  },

  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error("Storage GetAllKeys Error:", error);
      return [];
    }
  },
};
export default storage;
