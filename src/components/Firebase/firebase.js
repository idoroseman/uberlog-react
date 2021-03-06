import app from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore";
import 'firebase/storage';


const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(config);
    }else {
      app.app(); // if already initialized, use that one
    }
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
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

  deleteField = () => app.firestore.FieldValue.delete()
  
  // *** Storage API ***

  storage = () => this.storage;
  storageRef = () => this.storage.ref();

}

export default Firebase;
