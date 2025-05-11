
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useMedicine } from "@/context/MedicineContext";
import { formatDate, formatTime } from "@/utils/helpers";
import { Medicine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";

interface MedicineDoseSummary {
  medicine: Medicine;
  takenCount: number;
  totalDoses: number;
}

const MedicineCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { medicines } = useMedicine();
  
  const formatSelectedDate = (date?: Date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };
  
  // Get medicines for the selected date with dose status
  const getMedicineSummaryForDate = (date: string): MedicineDoseSummary[] => {
    return medicines.map(medicine => {
      const takenDoses = medicine.takenDoses[date] || [];
      const takenCount = takenDoses.filter(Boolean).length;
      
      return {
        medicine,
        takenCount,
        totalDoses: medicine.frequency
      };
    });
  };
  
  // Calculate days with medicine doses for highlighting in the calendar
  const getDaysWithMedicines = () => {
    const daysWithMeds = new Set<string>();
    
    medicines.forEach(medicine => {
      Object.keys(medicine.takenDoses).forEach(date => {
        daysWithMeds.add(date);
      });
    });
    
    return Array.from(daysWithMeds).map(dateStr => new Date(dateStr));
  };
  
  const selectedDateStr = formatSelectedDate(selectedDate);
  const medicineSummaries = getMedicineSummaryForDate(selectedDateStr);
  const daysWithMeds = getDaysWithMedicines();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="pointer-events-auto rounded-md border"
          modifiers={{
            hasMedicine: daysWithMeds
          }}
          modifiersStyles={{
            hasMedicine: {
              fontWeight: "bold",
              backgroundColor: "rgba(236, 72, 153, 0.1)", // Pink color with opacity
              borderRadius: "100%"
            }
          }}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center text-pink-700">
          <CalendarClock className="mr-2 h-5 w-5 text-pink-500" />
          Medicines for {selectedDate ? formatDate(selectedDateStr) : "Today"}
        </h3>
        
        {medicineSummaries.length > 0 ? (
          <div className="space-y-3">
            {medicineSummaries.map((summary) => (
              <Card key={summary.medicine.id} className="p-4 flex justify-between items-center border-pink-100 bg-white">
                <div>
                  <h4 className="font-medium text-pink-800">{summary.medicine.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {summary.medicine.times.map((time, i) => (
                      <Badge 
                        key={i} 
                        variant={summary.medicine.takenDoses[selectedDateStr]?.[i] ? "default" : "outline"}
                        className={
                          summary.medicine.takenDoses[selectedDateStr]?.[i] 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "border-pink-300 text-pink-700"
                        }
                      >
                        {formatTime(time)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className={summary.takenCount === summary.totalDoses ? "bg-green-500" : "bg-pink-500"}>
                  {summary.takenCount}/{summary.totalDoses} doses
                </Badge>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-pink-400 bg-pink-50 rounded-lg">
            <p>No medicines scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineCalendar;
