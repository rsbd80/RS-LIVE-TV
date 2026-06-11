const firebaseConfig = {
    apiKey: "AIzaSyBW7EtBSaGq4BO4QuSy2unTJrMobQ3lIfU",
    authDomain: "rs-tv-admin.firebaseapp.com",
    databaseURL: "https://rs-tv-admin-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rs-tv-admin",
    storageBucket: "rs-tv-admin.firebasestorage.app",
    appId: "1:619060422153:web:610a287d0a0dae0299fad8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
