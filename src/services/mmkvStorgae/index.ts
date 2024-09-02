import {APP_DATA_ENCRYPTION_KEY} from '@env';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'storage',
  encryptionKey: APP_DATA_ENCRYPTION_KEY,
});
