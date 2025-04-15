import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register";

export default function AuthForm() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login, register, loading } = useAuth();

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === "login") {
      await login(email, password);
    } else {
      await register(username, email, password);
    }
  };

  return (
    <Card className="max-w-md w-full bg-black/50 backdrop-blur-sm border-cyan-500/30">
      <CardContent className="p-6 sm:p-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center font-['Orbitron'] text-cyan-400 animate-pulse">
          TETRIS
        </h1>
        
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-4 grid-rows-1 gap-1">
            <div className="w-7 h-7 bg-cyan-400"></div>
            <div className="w-7 h-7 bg-cyan-400"></div>
            <div className="w-7 h-7 bg-cyan-400"></div>
            <div className="w-7 h-7 bg-cyan-400"></div>
          </div>
        </div>
        
        {/* Login Form */}
        {authMode === "login" && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                type="email" 
                id="email" 
                className="bg-black/50 border-cyan-500 focus:border-fuchsia-500 text-white"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input 
                type="password" 
                id="password"
                className="bg-black/50 border-cyan-500 focus:border-fuchsia-500 text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full py-6 bg-cyan-500 hover:bg-cyan-600 text-black font-bold hover:shadow-[0_0_15px_rgba(0,255,255,0.8)]"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </Button>
            
            <div className="text-center text-gray-400">
              <p>Don't have an account? 
                <Button 
                  variant="link" 
                  className="text-cyan-400 hover:text-fuchsia-400 p-0 ml-1 h-auto"
                  onClick={toggleAuthMode}
                  type="button"
                >
                  Sign Up
                </Button>
              </p>
            </div>
          </form>
        )}
        
        {/* Registration Form */}
        {authMode === "register" && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input 
                type="text" 
                id="username" 
                className="bg-black/50 border-cyan-500 focus:border-fuchsia-500 text-white"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reg-email" className="text-white">Email</Label>
              <Input 
                type="email" 
                id="reg-email" 
                className="bg-black/50 border-cyan-500 focus:border-fuchsia-500 text-white"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reg-password" className="text-white">Password</Label>
              <Input 
                type="password" 
                id="reg-password"
                className="bg-black/50 border-cyan-500 focus:border-fuchsia-500 text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full py-6 bg-fuchsia-500 hover:bg-fuchsia-600 text-black font-bold hover:shadow-[0_0_15px_rgba(255,0,255,0.8)]"
              disabled={loading}
            >
              {loading ? "SIGNING UP..." : "SIGN UP"}
            </Button>
            
            <div className="text-center text-gray-400">
              <p>Already have an account? 
                <Button 
                  variant="link" 
                  className="text-cyan-400 hover:text-fuchsia-400 p-0 ml-1 h-auto"
                  onClick={toggleAuthMode}
                  type="button"
                >
                  Log In
                </Button>
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
