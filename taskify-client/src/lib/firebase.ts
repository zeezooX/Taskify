import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { api } from './axios';

const firebaseConfig = {
	apiKey: 'AIzaSyCGAb7pB6bTBYR-_y-zhMubhwHIGkXh0Ac',
	authDomain: 'taskify-b0e4a.firebaseapp.com',
	projectId: 'taskify-b0e4a',
	storageBucket: 'taskify-b0e4a.firebasestorage.app',
	messagingSenderId: '680165067456',
	appId: '1:680165067456:web:4b8eb1baa8d219dbd37b25',
	measurementId: 'G-SY0WEJXMMF'
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

const VAPID_KEY =
	'BBqVxgfh0g9EwEUYOUKXKBU_foh6GXfSDGa9MJfawFOICNtCdYUzxk1EtQmlAQ49qZ0-DFsH1SmqXoLhQwJRNAM';

export const syncFcmToken = async () => {
	try {
		const permission = await Notification.requestPermission();

		if (permission !== 'granted') {
			console.log('Notification permission not granted.');
			return;
		}

		const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

		if (!currentToken) {
			console.log('No registration token available. Request permission to generate one.');
			return;
		}

		const sentToken = localStorage.getItem('fcmToken');

		if (currentToken === sentToken) {
			console.log('FCM Token is already up to date.');
		} else {
			console.log('FCM Token changed or not sent before. Sending to server...');
			await api.post('/auth/fcm-token', { token: currentToken });
			localStorage.setItem('fcmToken', currentToken);
			console.log('FCM Token sent to server and stored locally.');
		}
	} catch (error) {
		console.error('Error syncing FCM token:', error);
	}
};

export const deleteFcmToken = async () => {
	localStorage.removeItem('fcmToken');
	console.log('FCM Token removed from local storage.');
};

export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});
