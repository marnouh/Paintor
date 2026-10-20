import 'fake-indexeddb/auto';
import crypto from 'crypto';

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

// Simple test to ensure fake-indexeddb is working
const req = indexedDB.open('TestDB', 1);
req.onupgradeneeded = () => {
  req.result.createObjectStore('testStore');
};
req.onsuccess = () => {
  console.log('fake-indexeddb initialized successfully!');
  process.exit(0);
};
req.onerror = () => {
  console.error('fake-indexeddb error:', req.error);
  process.exit(1);
};
