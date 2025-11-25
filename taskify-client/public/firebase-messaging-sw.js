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
		icon: '/vite.svg',
		data: payload.data
	};
	self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
	console.log('[firebase-messaging-sw.js] Notification click Received.', event);
	event.notification.close();

	const clickAction = event.notification.data?.click_action;
	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
			for (const client of windowClients) {
				if (client.url === clickAction && 'focus' in client) return client.focus();
			}
			if (clients.openWindow) return clients.openWindow(clickAction);
		})
	);
});
