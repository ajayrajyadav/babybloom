"use client";
import { signInWithGoogle, signInWithGithub, logout } from "../src/auth";

export default function Home() {
  return (
    <div>
      <h1>Welcome to BabyBloom</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInWithGithub}>Sign in with GitHub</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
