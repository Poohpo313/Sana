
import React from "react";
import Layout from "@/components/Layout";
import MedicineCalendar from "@/components/MedicineCalendar";
import { Calendar, Clock } from "lucide-react";

const CalendarPage = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2">
          <Calendar className="h-6 w-6 text-pink-600" />
          <h1 className="text-xl font-bold text-pink-700">Medicine Calendar</h1>
        </div>
        <p className="text-pink-600 text-sm flex items-center">
          <Clock className="h-4 w-4 mr-1 inline" />
          Track your medication history and schedule with Sana
        </p>
        <MedicineCalendar />
      </div>
    </Layout>
  );
};

export default CalendarPage;
