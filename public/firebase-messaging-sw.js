// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDrBogy3kEaNcD_g5j9A11zn7m4gCZ4gg8",
  authDomain: "psychix-com.firebaseapp.com",
  projectId: "psychix-com",
  storageBucket: "psychix-com.appspot.com",
  messagingSenderId: "48595975337",
  appId: "1:48595975337:web:a536abd812f12b8eae7db8",
  measurementId: "G-J6JYNG558Y",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  new Notification(notificationTitle, notificationOptions);
});
