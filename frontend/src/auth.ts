import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebaseConfig";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("GitHub sign-in error:", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
