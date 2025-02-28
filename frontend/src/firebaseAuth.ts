import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Ensure firebaseConfig.ts exists

export const monitorAuthState = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
    if (user) {
      console.log("✅ User is signed in:", user);
    } else {
      console.log("❌ No user is signed in.");
    }
  });
};