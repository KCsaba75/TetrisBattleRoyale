import { useCallback, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const auth = getAuth();
  const db = getFirestore();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userCredential.user.displayName || email}!`,
      });
      setLocation("/game");
      return userCredential.user;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Login error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth, toast, setLocation]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set display name
      await updateProfile(user, {
        displayName: username
      });
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      });
      
      toast({
        title: "Account created successfully",
        description: `Welcome, ${username}!`,
      });
      
      setLocation("/game");
      return user;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Registration error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth, db, toast, setLocation]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
      });
      setLocation("/");
      return true;
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Logout error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth, toast, setLocation]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user data in Firestore if it's a new user
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      }, { merge: true });  // merge: true to avoid overwriting existing data
      
      toast({
        title: "Google login successful",
        description: `Welcome, ${user.displayName}!`,
      });
      
      setLocation("/game");
      return user;
    } catch (error: any) {
      console.error("Google login error:", error);
      
      // Don't show the popup cancellation as an error
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          title: "Google login failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth, db, toast, setLocation]);

  const loginAsGuest = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      // Generate a random guest name
      const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;
      
      // Set display name for the anonymous user
      await updateProfile(user, {
        displayName: guestName
      });
      
      // Store minimal guest data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: guestName,
        isGuest: true,
        createdAt: new Date(),
      });
      
      toast({
        title: "Logged in as guest",
        description: `Welcome, ${guestName}! Your scores will be saved as a guest.`,
      });
      
      setLocation("/game");
      return user;
    } catch (error: any) {
      console.error("Guest login error:", error);
      toast({
        title: "Guest login failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth, db, toast, setLocation]);

  return {
    login,
    register,
    logout,
    loginWithGoogle,
    loginAsGuest,
    loading
  };
}
