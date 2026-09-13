import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

let appInstance = null;

class Firebase {
  constructor() {
    if (!appInstance) {
      appInstance = firebase.initializeApp(config);
    }
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** FireStore API ***

  users = () => this.db.collection('hams');

  user = () => this.db.collection('hams').doc(this.auth.currentUser.uid);

  logbook = (index) => this.db.collection('hams').doc(this.auth.currentUser.uid).collection('log_'+index.toString())

  deleteField = () => firebase.firestore.FieldValue.serverTimestamp()
  
  // *** Storage API ***

  storage = () => this.storage;
  storageRef = () => this.storage.ref();

}

export default Firebase;
