import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCM5Whnq6aNbPaoSdwk4gLDW66sDuAHQxg",
  authDomain: "mydashio.firebaseapp.com"
};
const fire = firebase.initializeApp(config);

export default fire;