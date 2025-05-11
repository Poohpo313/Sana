
import React from "react";
import { useProfile } from "@/context/ProfileContext";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  const { isAuthenticated } = useProfile();
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <header className="pink-header-gradient py-4 px-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-white text-xl font-bold">Sana</h1>
          <p className="text-white/80 text-sm">Your Medication Reminder</p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md flex flex-col justify-center">
        <LoginForm />
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; 2025 Sana. All rights reserved.<br/>
        Made with care for your health.
      </footer>
    </div>
  );
};

export default LoginPage;
