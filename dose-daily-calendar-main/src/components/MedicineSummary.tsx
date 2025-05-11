
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMedicine } from "@/context/MedicineContext";
import { getTodayDateString } from "@/utils/helpers";

const MedicineSummary: React.FC = () => {
  const { medicines } = useMedicine();
  const todayStr = getTodayDateString();
  
  // Calculate total doses and taken doses for today
  const totalDosesToday = medicines.reduce((total, med) => total + med.frequency, 0);
  
  const takenDosesToday = medicines.reduce((total, med) => {
    const takenToday = med.takenDoses[todayStr] || [];
    return total + takenToday.filter(Boolean).length;
  }, 0);
  
  // Calculate adherence percentage
  const adherencePercentage = totalDosesToday > 0 
    ? Math.round((takenDosesToday / totalDosesToday) * 100) 
    : 0;

  return (
    <Card className="border-pink-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-pink-700">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-pink-600">Doses Taken</span>
              <span className="font-medium text-pink-800">{takenDosesToday}/{totalDosesToday}</span>
            </div>
            <Progress value={adherencePercentage} className="h-2 bg-pink-100" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <p className="text-xs text-pink-600">Total Medicines</p>
              <p className="text-xl font-bold text-pink-700">{medicines.length}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <p className="text-xs text-pink-600">Adherence</p>
              <p className="text-xl font-bold text-pink-700">{adherencePercentage}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineSummary;

