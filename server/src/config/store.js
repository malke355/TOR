import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialUsers,
  initialOpportunities,
  initialTradeProducts,
  initialServices,
  initialNews,
  initialDocuments,
  initialMessages
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data holder
let store = {
  users: [...initialUsers],
  opportunities: [...initialOpportunities],
  tradeProducts: [...initialTradeProducts],
  services: [...initialServices],
  news: [...initialNews],
  documents: [...initialDocuments],
  messages: [...initialMessages]
};

// Load saved data if file exists
export function initStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8');
      const loaded = JSON.parse(data);
      store = { ...store, ...loaded };
      console.log(' [Store] Loaded persisted data successfully from store.json');
    } else {
      saveStore();
      console.log(' [Store] Initialized store with authentic Oromia TIB seed data');
    }
  } catch (err) {
    console.error(' [Store] Error reading store file, using in-memory defaults:', err.message);
  }
}

export function saveStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error(' [Store] Error saving store file:', err.message);
  }
}

export function getStore() {
  return store;
}

export function resetStore() {
  store = {
    users: [...initialUsers],
    opportunities: [...initialOpportunities],
    tradeProducts: [...initialTradeProducts],
    services: [...initialServices],
    news: [...initialNews],
    documents: [...initialDocuments],
    messages: [...initialMessages]
  };
  saveStore();
  return store;
}
