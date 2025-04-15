import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const auth = getAuth();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocation("/game");
      }
    });
    
    return () => unsubscribe();
  }, [auth, setLocation]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900 bg-fixed">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyan glow */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[100px]"></div>
        {/* Purple glow */}
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-fuchsia-500/10 blur-[100px]"></div>
      </div>
      
      <AuthForm />
    </div>
  );
}
