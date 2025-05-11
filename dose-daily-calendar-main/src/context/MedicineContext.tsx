
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Medicine, DoseStatus } from '../types';

interface MedicineContextType {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'takenDoses'>) => void;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  markDose: (medicineId: string, date: string, doseIndex: number, taken: boolean) => void;
  getMedicinesForDate: (date: string) => Medicine[];
  getDoseStatus: (medicineId: string, date: string, doseIndex: number) => boolean | null;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const MedicineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Load medicines from localStorage on initial render
  useEffect(() => {
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      try {
        setMedicines(JSON.parse(storedMedicines));
      } catch (error) {
        console.error('Failed to parse stored medicines:', error);
      }
    }
  }, []);

  // Save medicines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  const addMedicine = (medicineData: Omit<Medicine, 'id' | 'takenDoses'>) => {
    const newMedicine: Medicine = {
      ...medicineData,
      id: Date.now().toString(),
      takenDoses: {},
    };
    
    setMedicines([...medicines, newMedicine]);
  };

  const updateMedicine = (updatedMedicine: Medicine) => {
    setMedicines(
      medicines.map((medicine) =>
        medicine.id === updatedMedicine.id ? updatedMedicine : medicine
      )
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id));
  };

  const markDose = (medicineId: string, date: string, doseIndex: number, taken: boolean) => {
    setMedicines(
      medicines.map((medicine) => {
        if (medicine.id === medicineId) {
          // Create a deep copy of takenDoses
          const updatedTakenDoses = { ...medicine.takenDoses };
          
          // Initialize the array for this date if it doesn't exist
          if (!updatedTakenDoses[date]) {
            updatedTakenDoses[date] = Array(medicine.frequency).fill(false);
          }
          
          // Ensure the array exists and has enough elements
          if (!Array.isArray(updatedTakenDoses[date])) {
            updatedTakenDoses[date] = Array(medicine.frequency).fill(false);
          } else if (updatedTakenDoses[date].length < medicine.frequency) {
            const newArray = [...updatedTakenDoses[date]];
            while (newArray.length < medicine.frequency) {
              newArray.push(false);
            }
            updatedTakenDoses[date] = newArray;
          }
          
          // Update the specific dose
          updatedTakenDoses[date][doseIndex] = taken;
          
          return {
            ...medicine,
            takenDoses: updatedTakenDoses,
          };
        }
        return medicine;
      })
    );
  };

  const getMedicinesForDate = (date: string) => {
    return medicines;
  };

  const getDoseStatus = (medicineId: string, date: string, doseIndex: number): boolean | null => {
    const medicine = medicines.find((m) => m.id === medicineId);
    if (!medicine) return null;
    
    // Safely access the takenDoses data
    const dateData = medicine.takenDoses[date];
    if (!dateData) return false;
    
    return dateData[doseIndex] === true;
  };

  const value = {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    markDose,
    getMedicinesForDate,
    getDoseStatus,
  };

  return <MedicineContext.Provider value={value}>{children}</MedicineContext.Provider>;
};

export const useMedicine = () => {
  const context = useContext(MedicineContext);
  if (context === undefined) {
    throw new Error('useMedicine must be used within a MedicineProvider');
  }
  return context;
};
