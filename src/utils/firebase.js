import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getDatabase, ref, onValue } from "firebase/database";

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENT,
};

var firebaseApp;
var messaging;

export const firebseInit = async () => {
  try {
    firebaseApp = await initializeApp(firebaseConfig);
    messaging = await getMessaging(firebaseApp);
    return firebaseApp;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getDbdata = (callback) => {
  if (firebaseApp) {
    const db = getDatabase();
    const starCountRef = ref(db);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }
};

export const firebaseRealtimeDatabaseListener = (userId, listenerRoute, callback) => {
  if (firebaseApp) {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + userId + listenerRoute);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }
};

export const fetchToken = async () => {
  return await getToken(messaging, {
    vapidKey: process.env.FIREBASE__PUSHCERTIFICATE,
  })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("NOTIFICATION AAYA");
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.image,
      });
      resolve(payload);
    });
  });
};
