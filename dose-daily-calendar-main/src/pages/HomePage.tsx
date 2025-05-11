
import React, { useState } from "react";
import Layout from "@/components/Layout";
import MedicineCard from "@/components/MedicineCard";
import MedicineSummary from "@/components/MedicineSummary";
import MedicineForm from "@/components/MedicineForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMedicine } from "@/context/MedicineContext";
import { Button } from "@/components/ui/button";
import { Clock, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import FloatingActionButton from "@/components/FloatingActionButton";

const HomePage = () => {
  const { medicines } = useMedicine();
  const { toast } = useToast();
  const [editingMedicine, setEditingMedicine] = useState<string | null>(null);
  
  // Get the medicine being edited, if any
  const medicineBeingEdited = medicines.find(med => med.id === editingMedicine);
  
  const handleEditSuccess = () => {
    toast({
      title: "Medicine Updated",
      description: "Your medicine has been successfully updated.",
    });
    setEditingMedicine(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="pb-2">
          <MedicineSummary />
        </section>
        
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <Clock className="mr-2 h-5 w-5 text-medicine-primary" />
              Today's Medications
            </h2>
          </div>
          
          {medicines.length > 0 ? (
            <div className="space-y-4">
              {medicines.map(medicine => (
                <MedicineCard 
                  key={medicine.id} 
                  medicine={medicine} 
                  onEdit={() => setEditingMedicine(medicine.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md p-6 text-center">
              <CalendarClock className="h-12 w-12 mx-auto text-medicine-secondary mb-2" />
              <h3 className="text-lg font-medium">No Medicines Added Yet</h3>
              <p className="text-gray-500 mb-4">Click the + button to add your first medication</p>
            </div>
          )}
        </section>
        
        <Dialog open={!!editingMedicine} onOpenChange={() => setEditingMedicine(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              {medicineBeingEdited && (
                <MedicineForm 
                  existingMedicine={medicineBeingEdited} 
                  onSuccess={handleEditSuccess} 
                />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      
      <FloatingActionButton />
    </Layout>
  );
};

export default HomePage;
