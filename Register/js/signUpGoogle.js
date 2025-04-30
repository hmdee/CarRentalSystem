
// const firebaseConfig = {
//     apiKey: "AIzaSyDEU3PXK0-i73qo3YiYSvF0MndKiBFsXpc",
//     authDomain: "car-rental-auth-4807b.firebaseapp.com",
//   };
//   firebase.initializeApp(firebaseConfig);
// const provider = new firebase.auth.GoogleAuthProvider();
// firebase.auth().useDeviceLanguage();

// export default async function signInWithGoogle() {
//   try {
//     const result = await firebase.auth().signInWithPopup(provider);
//     const credential = result.credential;
//     const token = credential.accessToken;
//     const user = result.user;
//     console.log('User Info:', user);
//   } catch (error) {
//     console.error('Sign-in Error:', error);
//   }
// }

// async function signOutUser() {
//   try {
//     await firebase.auth().signOut();
//     console.log('User signed out.');
//   } catch (error) {
//     console.error('Sign-out Error:', error);
//   }
// }

// firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//     console.log('Logged in as:', user.displayName);
//   } else {
//     console.log('User logged out.');
//   }
// });