
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md border border-pink-100">
        <h1 className="text-3xl font-bold text-pink-500 mb-2">404</h1>
        <p className="text-lg mb-6 text-pink-700">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-pink-500 hover:bg-pink-600"
        >
          <Home className="h-4 w-4 mr-2" />
          Go back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
