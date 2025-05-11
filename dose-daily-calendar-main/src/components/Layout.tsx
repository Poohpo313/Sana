
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Map paths to tab values
  const getTabValue = () => {
    if (currentPath === "/calendar") return "calendar";
    if (currentPath === "/about") return "about";
    if (currentPath === "/profile") return "profile";
    return "home";
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <header className="pink-header-gradient py-4 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-white text-xl font-bold">Sana</h1>
            <p className="text-white/80 text-sm">Your Medication Reminder</p>
          </div>
          <button 
            onClick={() => navigate("/profile")}
            className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center"
            aria-label="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-md">
        {children}
      </main>
      
      <footer className="mt-auto bg-white border-t border-pink-100 p-2">
        <Tabs value={getTabValue()} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger
              value="home"
              onClick={() => navigate("/")}
              className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-600"
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              onClick={() => navigate("/calendar")}
              className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-600"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="about"
              onClick={() => navigate("/about")}
              className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-600"
            >
              About
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};

export default Layout;
