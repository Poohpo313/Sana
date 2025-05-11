
import { format, parse, isToday, isTomorrow, isYesterday } from "date-fns";

// Format time from "HH:MM" to "h:mm a" (e.g., "8:30 AM")
export const formatTime = (time: string): string => {
  try {
    const timeObj = parse(time, "HH:mm", new Date());
    return format(timeObj, "h:mm a");
  } catch (error) {
    console.error("Failed to parse time:", time, error);
    return time;
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMM d"); // e.g., "Mon, Jan 5"
  } catch (error) {
    console.error("Failed to format date:", dateString, error);
    return dateString;
  }
};

// Get today's date as YYYY-MM-DD
export const getTodayDateString = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

// Check if a time string (HH:MM) is in the past for today
export const isTimeInPastToday = (timeString: string): boolean => {
  const [hours, minutes] = timeString.split(":").map(Number);
  
  const timeToday = new Date();
  timeToday.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  
  return timeToday < now;
};

// Play an alarm sound
export const playAlarmSound = (): void => {
  try {
    const audio = new Audio('/alarm-sound.mp3');
    audio.volume = 0.7;
    audio.play().catch(error => {
      console.error("Failed to play alarm sound:", error);
    });
  } catch (error) {
    console.error("Error creating audio element:", error);
  }
};

// Schedule a notification
export const scheduleNotification = async (
  title: string,
  body: string,
  time: string,
  date: string = getTodayDateString(),
  isAlarm: boolean = false
): Promise<string> => {
  // This is a mock implementation
  // In a real app, this would integrate with a notification API
  console.log(`Scheduling ${isAlarm ? 'alarm' : 'notification'} for ${date} at ${time}: ${title}`);
  
  // If this is for today and the browser supports notifications, show one immediately for testing
  if (date === getTodayDateString() && "Notification" in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const options = {
          body,
          icon: '/favicon.ico',
          silent: !isAlarm
        };
        
        // Create and show notification
        const notification = new Notification(title, options);
        
        // If it's an alarm type, also play a sound
        if (isAlarm) {
          playAlarmSound();
        }
      }
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }
  
  // Return a mock notification ID
  return `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Cancel a previously scheduled notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  // Mock implementation
  console.log(`Canceling notification with ID: ${notificationId}`);
};

// Get a unique key for a medicine dose
export const getDoseKey = (medicineId: string, date: string, doseIndex: number): string => {
  return `${medicineId}_${date}_${doseIndex}`;
};
