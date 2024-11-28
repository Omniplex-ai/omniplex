import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from '@firebase/firestore';

// Firebase Config
export const firebaseConfig = {
	apiKey: 'AIzaSyC9Aro2yaoG73mqueMXA_TQROsdnbU3dKA',
	authDomain: 'omni-a6740.firebaseapp.com',
	projectId: 'omni-a6740',
	storageBucket: 'omni-a6740.firebasestorage.app',
	messagingSenderId: '149345944472',
	appId: '1:149345944472:web:fd9946dd6eb7643d14a1ed',
	measurementId: 'G-2ZW5TF0L9W',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const initializeFirebase = () => {
	return app;
};
