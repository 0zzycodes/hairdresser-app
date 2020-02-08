import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCYWOTQ59FgMAemwx0QiQkmbsBgyEjcqkk',
  authDomain: 'haird-client-8ed26.firebaseapp.com',
  databaseURL: 'https://haird-client-8ed26.firebaseio.com',
  projectId: 'haird-client-8ed26',
  storageBucket: 'haird-client-8ed26.appspot.com',
  messagingSenderId: '326611688986',
  appId: '1:326611688986:web:eb212291fe4ead95dbbba3',
  measurementId: 'G-JN40RZNLEH'
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const { displayName, email, uid } = userAuth;
    const joined = new Date();
    try {
      await userRef.set({
        id: uid,
        verified: false,
        displayName,
        email,
        joined,
        ...additionalData
      });
    } catch (error) {
      console.log('Error creating user');
    }
  }
  return userRef;
};
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
