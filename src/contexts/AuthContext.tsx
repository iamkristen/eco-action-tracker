import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const saveUserToFirestore = async (user: User) => {
    const userRef = doc(db, "users", user.id);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, user);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const currentUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || undefined,
        };
        setUser(currentUser);
        await saveUserToFirestore(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const currentUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Anonymous",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || undefined,
      };
      setUser(currentUser);
      await saveUserToFirestore(currentUser);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/wrong-password") {
          throw new Error("Incorrect password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
          throw new Error("No account found with this email.");
        } else if (error.code === "auth/account-exists-with-different-credential") {
          throw new Error("An account exists with a different sign-in method. Please try signing in with Google.");
        } else if (error.code === "auth/invalid-credential") {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes("google.com")) {
            throw new Error("This email is linked to Google. Please log in using Google.");
          }
        }
      }
      throw new Error("Login failed. Please try again later.");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const currentUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || undefined,
      };
      setUser(currentUser);
      await saveUserToFirestore(currentUser);
    } catch (error) {
      throw new Error("Google sign-in failed. Please try again.");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    await updateProfile(firebaseUser, { displayName: name });

    const newUser = {
      id: firebaseUser.uid,
      name: name,
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || undefined,
    };
    setUser(newUser);
    await saveUserToFirestore(newUser);
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}