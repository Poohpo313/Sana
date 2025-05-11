
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/context/ProfileContext";
import { User, Edit, LogOut, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { profile, updateProfile, logout } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(profile.profilePicture);

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
    
    // Update users array if email exists
    if (profile.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === profile.email);
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name,
          age,
          profilePicture
        };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
    
    updateProfile({
      ...profile,
      name,
      age,
      profilePicture
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="h-24 w-24 mb-2">
              <Avatar className="h-full w-full">
                <AvatarImage src={profile.profilePicture} alt={profile.name} />
                <AvatarFallback className="bg-pink-100">
                  <User className="h-12 w-12 text-pink-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">{profile.name}</h1>
            <p className="text-gray-500 text-sm">{profile.email || "No email set"}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{profile.name || "Not set"}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{profile.age || "Not set"}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full border-pink-200 text-pink-500 hover:bg-pink-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative h-24 w-24 rounded-full bg-gray-100 mb-2 overflow-hidden flex items-center justify-center">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <label htmlFor="profile-edit-upload" className="cursor-pointer text-sm text-pink-500 hover:underline">
                Change profile picture
              </label>
              <input
                id="profile-edit-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-pink-200 focus:border-pink-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-pink-200 focus:border-pink-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProfilePage;
