import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyA6fBKIZuuHw0pPbuABXSPYR-DKf8Ngufo",
    authDomain: "rnapp-b2975.firebaseapp.com",
    projectId: "rnapp-b2975",
    storageBucket: "rnapp-b2975.appspot.com",
    messagingSenderId: "352802350807",
    appId: "1:352802350807:web:731f51b069394dbf073292"
};

export default class Firebase {
    static db;

    static init() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(config);
        }
        Firebase.db = firebase.firestore();
    }
}