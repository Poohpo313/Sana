
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/context/ProfileContext";
import { UserPlus, Upload } from "lucide-react";
import { UserProfile } from "../types";

const ProfileSetupPage = () => {
  const { profile, updateProfile, isAuthenticated, isProfileComplete } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(profile.name || "");
  const [age, setAge] = useState(profile.age || "");
  const [email, setEmail] = useState(profile.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | undefined>(profile.profilePicture || undefined);

  // Add effect to redirect after successful profile completion
  useEffect(() => {
    if (isAuthenticated && isProfileComplete) {
      navigate("/");
    }
  }, [isAuthenticated, isProfileComplete, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter your email to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password is required",
        description: "Please enter a password to secure your account.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    const newProfile = {
      name,
      age,
      email,
      password,
      profilePicture: profilePicture || undefined,
      isProfileSet: true
    };
    
    // Save user to users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.findIndex((user: any) => user.email === email);
    
    if (existingUser !== -1) {
      users[existingUser] = newProfile;
    } else {
      users.push(newProfile);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current profile (without password for security)
    const { password: _, ...profileWithoutPassword } = newProfile;
    updateProfile(profileWithoutPassword as UserProfile);
    
    toast({
      title: "Profile Created",
      description: "Your profile has been saved successfully.",
    });
    
    // Navigation is now handled by useEffect
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <header className="pink-header-gradient py-4 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-white text-xl font-bold">Sana</h1>
          <p className="text-white/80 text-sm">Your Medication Reminder</p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md flex flex-col justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="h-8 w-8 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create Profile</h1>
              <p className="text-gray-500">Please tell us about yourself</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center mb-4">
              <div className="relative h-24 w-24 rounded-full bg-gray-100 mb-2 overflow-hidden flex items-center justify-center">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <label htmlFor="profile-upload" className="cursor-pointer text-sm text-pink-500 hover:underline">
                Upload profile picture
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="border-pink-200 focus:border-pink-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-pink-200 focus:border-pink-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="border-pink-200 focus:border-pink-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password *</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="border-pink-200 focus:border-pink-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="border-pink-200 focus:border-pink-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              Create Account
            </Button>
          </form>
        </div>
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; 2025 Sana. All rights reserved.<br/>
        Made with care for your health.
      </footer>
    </div>
  );
};

export default ProfileSetupPage;
