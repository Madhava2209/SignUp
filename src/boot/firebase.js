import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

// paste the credentials 

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebase.auth()
const firebaseDB = firebase.database()

export { firebaseAuth, firebaseDB, firebaseApp}
