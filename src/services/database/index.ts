import Realm from 'realm';
import EncryptedStorage from 'react-native-encrypted-storage';
import { schemas, schemaVersion } from './schemas';

const ENCRYPTION_KEY_STORAGE = 'realm_encryption_key';

// 生成加密密钥
const generateEncryptionKey = (): string => {
  const array = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// 获取或创建加密密钥
const getOrCreateEncryptionKey = async (): Promise<string> => {
  try {
    let key = await EncryptedStorage.getItem(ENCRYPTION_KEY_STORAGE);
    if (!key) {
      key = generateEncryptionKey();
      await EncryptedStorage.setItem(ENCRYPTION_KEY_STORAGE, key);
    }
    return key;
  } catch (error) {
    console.error('Failed to get encryption key:', error);
    return generateEncryptionKey();
  }
};

// 数据库配置
let realmInstance: Realm | null = null;

// 初始化数据库
export const initializeDatabase = async (): Promise<Realm> => {
  if (realmInstance && !realmInstance.isClosed) {
    return realmInstance;
  }

  try {
    const encryptionKey = await getOrCreateEncryptionKey();

    const config: Realm.Configuration = {
      schema: schemas,
      schemaVersion: schemaVersion,
      encryptionKey: encryptionKey,
      path: 'accounting.realm',
    };

    realmInstance = await Realm.open(config);
    console.log('Database initialized successfully');
    return realmInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// 获取数据库实例
export const getDatabase = (): Realm => {
  if (!realmInstance || realmInstance.isClosed) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return realmInstance;
};

// 关闭数据库
export const closeDatabase = (): void => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};

// 删除数据库(用于测试或重置)
export const deleteDatabase = async (): Promise<void> => {
  closeDatabase();
  const encryptionKey = await getOrCreateEncryptionKey();
  const config: Realm.Configuration = {
    schema: schemas,
    schemaVersion: schemaVersion,
    encryptionKey: encryptionKey,
    path: 'accounting.realm',
  };
  await Realm.deleteFile(config);
};
