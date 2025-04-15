import { useCallback, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  getAuth
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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

  return {
    login,
    register,
    logout,
    loading
  };
}
