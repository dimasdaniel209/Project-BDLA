import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BirthdayConfig } from '../types';
import { DEFAULT_CONFIG } from './storage';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if specified
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const GLOBAL_CONFIG_DOC = 'birthday_config_live';

/**
 * Fetch global config from Firestore
 */
export async function getCloudBirthdayConfig(): Promise<BirthdayConfig | null> {
  try {
    const configDocRef = doc(db, 'settings', GLOBAL_CONFIG_DOC);
    const snap = await getDoc(configDocRef);
    if (snap.exists()) {
      return { ...DEFAULT_CONFIG, ...(snap.data() as Partial<BirthdayConfig>) };
    }
  } catch (error) {
    console.warn('Could not fetch cloud config (offline or first run):', error);
  }
  return null;
}

/**
 * Save birthday config to Firestore so all devices sync instantly
 */
export async function saveCloudBirthdayConfig(config: BirthdayConfig): Promise<boolean> {
  try {
    const configDocRef = doc(db, 'settings', GLOBAL_CONFIG_DOC);
    // Convert undefined to null or clean up if needed
    const payload = JSON.parse(JSON.stringify(config));
    await setDoc(configDocRef, {
      ...payload,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to save config to Cloud Firestore:', error);
    return false;
  }
}

/**
 * Subscribe to real-time changes across all devices
 */
export function subscribeToCloudBirthdayConfig(
  onUpdate: (config: BirthdayConfig) => void
): () => void {
  try {
    const configDocRef = doc(db, 'settings', GLOBAL_CONFIG_DOC);
    return onSnapshot(
      configDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const cleanConfig = { ...DEFAULT_CONFIG, ...(data as Partial<BirthdayConfig>) };
          onUpdate(cleanConfig);
        }
      },
      (error) => {
        console.warn('Realtime listener error:', error);
      }
    );
  } catch (e) {
    console.warn('Could not start realtime listener:', e);
    return () => {};
  }
}
