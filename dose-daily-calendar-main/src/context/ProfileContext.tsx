
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  isProfileComplete: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  email: '',
  profilePicture: '',
  isProfileSet: false,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load profile from localStorage on initial render
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setIsProfileComplete(parsedProfile.isProfileSet || false);
        setIsAuthenticated(!!parsedProfile.email);
      } catch (error) {
        console.error('Failed to parse stored profile:', error);
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsProfileComplete(!!profile.isProfileSet);
  }, [profile]);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsProfileComplete(!!newProfile.isProfileSet);
    if (newProfile.email) {
      setIsAuthenticated(true);
    }
  };

  const login = (email: string, password: string) => {
    // Login implementation - verify credentials against stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setProfile({
        ...userWithoutPassword,
        isProfileSet: true, // Ensure this is set explicitly
      });
      setIsAuthenticated(true);
      setIsProfileComplete(true); // Set profile complete for existing users
      return true;
    }
    return false;
  };

  const logout = () => {
    setProfile(defaultProfile);
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    localStorage.removeItem('userProfile');
  };

  const value = {
    profile,
    updateProfile,
    isProfileComplete,
    isAuthenticated,
    login,
    logout
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
