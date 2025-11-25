importScripts(
	'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
	'https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
	apiKey: 'AIzaSyCGAb7pB6bTBYR-_y-zhMubhwHIGkXh0Ac',
	authDomain: 'taskify-b0e4a.firebaseapp.com',
	projectId: 'taskify-b0e4a',
	storageBucket: 'taskify-b0e4a.firebasestorage.app',
	messagingSenderId: '680165067456',
	appId: '1:680165067456:web:4b8eb1baa8d219dbd37b25',
	measurementId: 'G-SY0WEJXMMF'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: '/firebase-logo.png'
	};
	self.registration.showNotification(notificationTitle, notificationOptions);
});
