import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/types";
import { formatTime, getTodayDateString, isTimeInPastToday } from "@/utils/helpers";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { useMedicine } from "@/context/MedicineContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onEdit }) => {
  const today = getTodayDateString();
  const { markDose, getDoseStatus, deleteMedicine } = useMedicine();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteMedicine(medicine.id);
    toast({
      title: "Medicine Deleted",
      description: `${medicine.name} has been removed from your medicines.`,
    });
    setDeleteDialogOpen(false);
  };
  
  const isPastDose = (time: string): boolean => {
    return isTimeInPastToday(time);
  };

  const handleDoseClick = (doseIndex: number) => {
    const currentStatus = getDoseStatus(medicine.id, today, doseIndex);
    markDose(medicine.id, today, doseIndex, currentStatus === null || currentStatus === false);
  };
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-pink-50 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{medicine.name}</CardTitle>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-pink-700 hover:text-pink-900 hover:bg-pink-100"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-pink-700 hover:text-pink-900 hover:bg-pink-100"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          {medicine.description && (
            <p className="text-xs text-gray-500 mt-1">{medicine.description}</p>
          )}
        </CardHeader>
        
        <CardContent className="py-4">
          <h3 className="font-semibold mb-2">Dosage Schedule</h3>
          <ul className="space-y-2">
            {medicine.times.map((time, index) => {
              const doseStatus = getDoseStatus(medicine.id, today, index);
              const taken = doseStatus === true;
              const disabled = isPastDose(time) ? false : true;
              
              return (
                <li key={index} className="flex items-center justify-between">
                  <span>{formatTime(time)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full ${
                      taken
                        ? "bg-green-500 text-white hover:bg-green-600 border-green-500"
                        : disabled
                        ? "border-gray-300 text-gray-500 cursor-not-allowed"
                        : "border-pink-500 text-pink-500 hover:bg-pink-50 hover:border-pink-600 hover:text-pink-600"
                    }`}
                    onClick={() => handleDoseClick(index)}
                    disabled={disabled}
                  >
                    {taken ? "Taken" : "Mark as Taken"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {medicine.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MedicineCard;
