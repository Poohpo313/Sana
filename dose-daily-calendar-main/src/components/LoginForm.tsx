
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile } from "@/context/ProfileContext";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const LoginForm = () => {
  const { login, isAuthenticated, isProfileComplete } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Add effect to redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      if (isProfileComplete) {
        navigate("/");
      } else {
        navigate("/setup");
      }
    }
  }, [isAuthenticated, isProfileComplete, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // Navigation is now handled by useEffect
    } else {
      setError("Invalid email or password");
    }
  };

  const handleCreateAccount = () => {
    navigate("/setup");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <LogIn className="h-8 w-8 text-pink-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500">Access your medication reminders</p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border-pink-200 focus:border-pink-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border-pink-200 focus:border-pink-500"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
        >
          Login
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Don't have an account?</p>
        <Button 
          variant="link" 
          onClick={handleCreateAccount}
          className="text-pink-500"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
