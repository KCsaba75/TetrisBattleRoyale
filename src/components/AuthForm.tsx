import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register";

export default function AuthForm() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login, register, loginWithGoogle, loginAsGuest, loading } = useAuth();

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
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="bg-black/30 border-gray-700 hover:bg-black/50 text-white flex items-center"
                onClick={() => loginWithGoogle()}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="bg-black/30 border-gray-700 hover:bg-black/50 text-white flex items-center"
                onClick={() => loginAsGuest()}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Guest
              </Button>
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
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="bg-black/30 border-gray-700 hover:bg-black/50 text-white flex items-center"
                onClick={() => loginWithGoogle()}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="bg-black/30 border-gray-700 hover:bg-black/50 text-white flex items-center"
                onClick={() => loginAsGuest()}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Guest
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
