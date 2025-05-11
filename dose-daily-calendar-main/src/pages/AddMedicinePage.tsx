
import React from "react";
import Layout from "@/components/Layout";
import MedicineForm from "@/components/MedicineForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const AddMedicinePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast({
      title: "Medicine Added",
      description: "Your medicine has been successfully added.",
    });
    navigate("/");
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="pb-2">
          <div className="flex items-center space-x-2">
            <PlusCircle className="h-6 w-6 text-medicine-primary" />
            <h1 className="text-xl font-bold">Add New Medicine</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Enter your medication details and set reminders
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <MedicineForm onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default AddMedicinePage;
