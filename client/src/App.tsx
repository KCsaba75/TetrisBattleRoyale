import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import LoginPage from "@/pages/LoginPage";
import GamePage from "@/pages/GamePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import NotFound from "@/pages/not-found";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // If user logs out, redirect to login page
      if (!user && location !== "/") {
        setLocation("/");
        toast({
          title: "Logged out",
          description: "You have been logged out",
        });
      }
    });
    
    return () => unsubscribe();
  }, [location, setLocation, toast]);
  
  // Protected route component
  const ProtectedRoute = ({ component: Component, ...rest }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    
    if (!user) {
      setLocation("/");
      return null;
    }
    
    return <Component {...rest} />;
  };

  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/game">
        {() => <ProtectedRoute component={GamePage} />}
      </Route>
      <Route path="/leaderboard">
        {() => <ProtectedRoute component={LeaderboardPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
