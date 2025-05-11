
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedicine } from "@/context/MedicineContext";
import { Medicine } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

interface TimeInput {
  hour: string;
  minute: string;
  period: "AM" | "PM";
}

interface MedicineFormProps {
  onSuccess?: () => void;
  existingMedicine?: Medicine;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ 
  onSuccess,
  existingMedicine
}) => {
  const { addMedicine, updateMedicine } = useMedicine();
  const [name, setName] = useState(existingMedicine?.name || "");
  const [description, setDescription] = useState(existingMedicine?.description || "");
  const [frequency, setFrequency] = useState(existingMedicine?.frequency.toString() || "1");
  const [reminderType, setReminderType] = useState<"alarm" | "notification">(
    existingMedicine?.reminderType || "notification"
  );
  
  // Add state for schedule type
  const [scheduleType, setScheduleType] = useState<"exact" | "interval">(
    existingMedicine?.scheduleType || "exact"
  );
  
  // Add state for interval duration
  const [intervalHours, setIntervalHours] = useState(
    existingMedicine?.intervalHours?.toString() || "4"
  );
  
  // State for first dose time when using intervals
  const [firstDoseTime, setFirstDoseTime] = useState<TimeInput>(
    existingMedicine?.times && existingMedicine.times.length > 0
      ? parseTimeString(existingMedicine.times[0])
      : { hour: "8", minute: "00", period: "AM" }
  );
  
  // Initialize time inputs from existing medicine or with defaults
  const initializeTimeInputs = (): TimeInput[] => {
    if (existingMedicine?.times && existingMedicine.times.length > 0) {
      return existingMedicine.times.map(timeStr => {
        return parseTimeString(timeStr);
      });
    }
    
    // Default to 9:00 AM for the first dose
    return [{ hour: "9", minute: "00", period: "AM" as const }];
  };
  
  const [timeInputs, setTimeInputs] = useState<TimeInput[]>(initializeTimeInputs);

  // Parse time string helper
  function parseTimeString(timeStr: string): TimeInput {
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? "PM" as const : "AM" as const;
    
    // Convert to 12-hour format
    hour = hour % 12;
    if (hour === 0) hour = 12;
    
    return {
      hour: hour.toString(),
      minute: minuteStr,
      period
    };
  }

  // Update number of time inputs when frequency changes
  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    const newFrequency = parseInt(value);
    
    if (scheduleType === "exact") {
      if (newFrequency > timeInputs.length) {
        // Add more time inputs
        const newTimeInputs = [...timeInputs];
        for (let i = timeInputs.length; i < newFrequency; i++) {
          newTimeInputs.push({ hour: "9", minute: "00", period: "AM" });
        }
        setTimeInputs(newTimeInputs);
      } else if (newFrequency < timeInputs.length) {
        // Remove extra time inputs
        setTimeInputs(timeInputs.slice(0, newFrequency));
      }
    }
  };

  const handleTimeInputChange = (index: number, field: keyof TimeInput, value: string) => {
    const newTimeInputs = [...timeInputs];
    
    if (field === 'hour') {
      let hourVal = parseInt(value);
      if (isNaN(hourVal) || hourVal < 1) hourVal = 1;
      if (hourVal > 12) hourVal = 12;
      newTimeInputs[index][field] = hourVal.toString();
    } else if (field === 'minute') {
      let minuteVal = parseInt(value);
      if (isNaN(minuteVal) || minuteVal < 0) minuteVal = 0;
      if (minuteVal > 59) minuteVal = 59;
      newTimeInputs[index][field] = minuteVal.toString().padStart(2, '0');
    } else {
      newTimeInputs[index][field] = value as "AM" | "PM";
    }
    
    setTimeInputs(newTimeInputs);
  };

  const handleFirstDoseChange = (field: keyof TimeInput, value: string) => {
    const newFirstDose = { ...firstDoseTime };
    
    if (field === 'hour') {
      let hourVal = parseInt(value);
      if (isNaN(hourVal) || hourVal < 1) hourVal = 1;
      if (hourVal > 12) hourVal = 12;
      newFirstDose[field] = hourVal.toString();
    } else if (field === 'minute') {
      let minuteVal = parseInt(value);
      if (isNaN(minuteVal) || minuteVal < 0) minuteVal = 0;
      if (minuteVal > 59) minuteVal = 59;
      newFirstDose[field] = minuteVal.toString().padStart(2, '0');
    } else {
      newFirstDose[field] = value as "AM" | "PM";
    }
    
    setFirstDoseTime(newFirstDose);
  };

  const convertTo24Hour = (timeInput: TimeInput): string => {
    let hour = parseInt(timeInput.hour);
    
    // Convert to 24-hour format
    if (timeInput.period === "PM" && hour < 12) {
      hour += 12;
    } else if (timeInput.period === "AM" && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${timeInput.minute}`;
  };

  // Generate time intervals based on first dose and interval hours
  const generateTimeIntervals = (): string[] => {
    const times: string[] = [];
    const intervalHoursNum = parseInt(intervalHours);
    const firstDoseTime24 = convertTo24Hour(firstDoseTime);
    
    // Calculate times based on intervals
    times.push(firstDoseTime24);
    
    let [firstHour, firstMinute] = firstDoseTime24.split(':').map(Number);
    
    for (let i = 1; i < parseInt(frequency); i++) {
      // Add interval hours to previous time
      firstHour += intervalHoursNum;
      
      // Handle day overflow (not handling multi-day schedules for simplicity)
      firstHour = firstHour % 24;
      
      const nextTime = `${firstHour.toString().padStart(2, '0')}:${firstMinute.toString().padStart(2, '0')}`;
      times.push(nextTime);
    }
    
    return times;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let times: string[];
    
    if (scheduleType === "exact") {
      times = timeInputs.map(convertTo24Hour);
    } else {
      times = generateTimeIntervals();
    }
    
    const medicineData = {
      name,
      description,
      frequency: parseInt(frequency),
      times,
      reminderType,
      scheduleType,
      intervalHours: scheduleType === "interval" ? parseInt(intervalHours) : undefined,
    };
    
    if (existingMedicine) {
      updateMedicine({
        ...existingMedicine,
        ...medicineData,
      });
    } else {
      addMedicine(medicineData);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Medicine Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter medicine name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about dosage, etc."
          className="min-h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Doses per Day</Label>
        <Select 
          value={frequency} 
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "time" : "times"} a day
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Schedule Type</Label>
        <Tabs 
          value={scheduleType} 
          onValueChange={(value) => setScheduleType(value as "exact" | "interval")} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="exact" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Exact Times
            </TabsTrigger>
            <TabsTrigger value="interval" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Time Intervals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="exact" className="mt-4">
            {timeInputs.map((timeInput, index) => (
              <div key={index} className="space-y-2 mb-4">
                <Label>{`Dose ${index + 1} Time`}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={timeInput.hour}
                    onChange={(e) => handleTimeInputChange(index, "hour", e.target.value)}
                    className="w-16"
                  />
                  <span>:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={timeInput.minute}
                    onChange={(e) => handleTimeInputChange(index, "minute", e.target.value)}
                    className="w-16"
                  />
                  <Select 
                    value={timeInput.period} 
                    onValueChange={(value) => handleTimeInputChange(index, "period", value as "AM" | "PM")}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="interval" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="intervalHours">Hours Between Doses</Label>
              <Select 
                value={intervalHours} 
                onValueChange={setIntervalHours}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 6, 8, 12].map((hours) => (
                    <SelectItem key={hours} value={hours.toString()}>
                      Every {hours} {hours === 1 ? "hour" : "hours"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>First Dose Time</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={firstDoseTime.hour}
                  onChange={(e) => handleFirstDoseChange("hour", e.target.value)}
                  className="w-16"
                />
                <span>:</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={firstDoseTime.minute}
                  onChange={(e) => handleFirstDoseChange("minute", e.target.value)}
                  className="w-16"
                />
                <Select 
                  value={firstDoseTime.period} 
                  onValueChange={(value) => handleFirstDoseChange("period", value as "AM" | "PM")}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-3 bg-pink-50 rounded-md border border-pink-100">
              <p className="text-sm text-pink-700 mb-2 font-medium">Schedule Preview:</p>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: parseInt(frequency) }).map((_, index) => {
                  let previewTime = "";
                  if (index === 0) {
                    previewTime = `${firstDoseTime.hour}:${firstDoseTime.minute} ${firstDoseTime.period}`;
                  } else {
                    let hour = parseInt(firstDoseTime.hour);
                    const isPM = firstDoseTime.period === "PM";
                    
                    // Convert to 24 hour for calculation
                    if (isPM && hour !== 12) hour += 12;
                    if (!isPM && hour === 12) hour = 0;
                    
                    // Add interval hours
                    hour = (hour + index * parseInt(intervalHours)) % 24;
                    
                    // Convert back to 12 hour
                    const newPeriod = hour >= 12 ? "PM" : "AM";
                    hour = hour % 12;
                    if (hour === 0) hour = 12;
                    
                    previewTime = `${hour}:${firstDoseTime.minute} ${newPeriod}`;
                  }
                  
                  return (
                    <div key={index} className="text-sm bg-white p-2 rounded border border-pink-100">
                      Dose {index + 1}: <span className="font-medium">{previewTime}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label>Reminder Type</Label>
        <RadioGroup 
          value={reminderType} 
          onValueChange={(value) => setReminderType(value as "alarm" | "notification")}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notification" id="notification" />
            <Label htmlFor="notification">Silent Notification</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alarm" id="alarm" />
            <Label htmlFor="alarm">Alarm Sound</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
        {existingMedicine ? "Update Medicine" : "Add Medicine"}
      </Button>
    </form>
  );
};

export default MedicineForm;
