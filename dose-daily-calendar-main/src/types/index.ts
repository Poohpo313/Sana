
export interface Medicine {
  id: string;
  name: string;
  frequency: number; // Number of times per day
  times: string[]; // Array of times in "HH:MM" format
  description?: string;
  reminderType: "alarm" | "notification";
  scheduleType?: "exact" | "interval"; // New field to track how times are specified
  intervalHours?: number; // Hours between doses when using interval schedule
  takenDoses: {
    [date: string]: boolean[]; // Map of date strings to array of boolean for each dose
  };
  notificationIds?: string[]; // Used for storing notification identifiers
}

export interface DoseStatus {
  medicineId: string;
  date: string;
  doseIndex: number;
  taken: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  age: string;
  birthday?: string; // Made optional
  email?: string;
  password?: string;
  profilePicture?: string;
  isProfileSet: boolean;
}
