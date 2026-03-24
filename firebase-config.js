// Konfigurasi Firebase - Ganti dengan punya lo sendiri
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey12345",
  authDomain: "zeta-rpg.firebaseapp.com",
  projectId: "zeta-rpg",
  storageBucket: "zeta-rpg.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence
db.enablePersistence()
  .catch(err => console.error("Offline persistence error:", err));