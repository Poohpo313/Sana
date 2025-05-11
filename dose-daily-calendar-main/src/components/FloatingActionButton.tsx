
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MedicineForm from "./MedicineForm";
import { useToast } from "@/hooks/use-toast";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = () => {
    setIsOpen(false);
    toast({
      title: "Medicine Added",
      description: "Your medicine has been successfully added.",
    });
  };

  return (
    <>
      <button 
        className="fixed right-6 bottom-20 h-14 w-14 rounded-full bg-pink-500 text-white shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors z-20"
        onClick={() => setIsOpen(true)}
        aria-label="Add medicine"
      >
        <Plus className="h-6 w-6" />
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
          </DialogHeader>
          <MedicineForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingActionButton;
