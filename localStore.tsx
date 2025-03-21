import AsyncStorage from '@react-native-async-storage/async-storage';

const storePayload = async (payload) => {
  try {
    const storedPayloads = await AsyncStorage.getItem('storedPayloads');
    const payloads = storedPayloads ? JSON.parse(storedPayloads) : [];
    payloads.push(payload);
    await AsyncStorage.setItem('storedPayloads', JSON.stringify(payloads));
  } catch (error) {
    console.log('Error storing payload', error);
  }
};

const getStoredPayloads = async () => {
  try {
    const storedPayloads = await AsyncStorage.getItem('storedPayloads');
    return storedPayloads ? JSON.parse(storedPayloads) : [];
  } catch (error) {
    console.log('Error retrieving stored payloads', error);
    return [];
  }
};

const clearStoredPayloads = async () => {
  try {
    await AsyncStorage.removeItem('storedPayloads');
  } catch (error) {
    console.log('Error clearing stored payloads', error);
  }
};
export { storePayload, getStoredPayloads, clearStoredPayloads };