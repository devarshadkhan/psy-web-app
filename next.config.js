/** @type {import('next').NextConfig} */

// This function can be marked `async` if using `await` inside

require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
  env: {
    BASE_URL: "https://api.psychix.com/v1",
    PROJECT_URL: "https://psychix.com",
    GOOGLE_KEY: "AIzaSyDNChSLCjUNJw6nfEtU2BWWDAc33htJkUQ",
    FIREBASE_API_KEY: "AIzaSyDrBogy3kEaNcD_g5j9A11zn7m4gCZ4gg8",
    FIREBASE_AUTH_DOMAIN: "psychix-com.firebaseapp.com",
    FIREBASE_PROJECTID: "psychix-com",
    FIREBASE_STORAGEBUCKET: "psychix-com.appspot.com",
    FIREBASE_MESSAGINGSENDERID: "48595975337",
    FIREBASE_APPID: "1:48595975337:web:a536abd812f12b8eae7db8",
    FIREBASE_MEASUREMENT: "G-J6JYNG558Y",
    GOOGLE_CLIENT_ID:
      "48595975337-69oe98q26h1tdg7tvb3atgupa04fq8rb.apps.googleusercontent.com",
    FIREBASE__PUSHCERTIFICATE:
      "BFm-F8EChMKFJ0iKNff14ZLwPac2uMvk0jAX9LWxtmrcN1at0SfeGj1t-6JDtRvqTALm2tsYIFXRrnsp_SZeSGs",
    STRIPE_KEY:
      "pk_live_51N84kvHWAI8GoBYTGJsFLfyoIsyfprbhkIVtTMMyTaQz0jHPm5eCv0Ylh81yhiVoBqckxmBETXwZNGoKfJivypXz007jbbWiIz",
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
