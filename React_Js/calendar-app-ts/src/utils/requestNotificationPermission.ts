import { Event } from './types';
import { format } from 'date-fns';


// Map to store timeout IDs for scheduled notifications
const notificationTimeouts: Record<number, NodeJS.Timeout> = {};

// Requests permission to show notifications
export const requestNotificationPermission = async (): Promise<void> => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else if (permission === 'denied') {
        console.log('Notification permission denied.');
      } else {
        console.log('Notification permission closed without action.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  } else {
    console.log('This browser does not support notifications.');
  }
};

// Calculates the time for a reminder, 30 minutes before the event
const calculateReminderTime = (eventDate: string, startTime: string): Date => {
  console.log('Event Date:', eventDate);
  const eventDateObj = new Date(eventDate);
  console.log('Event Date Object:', eventDateObj);
  const eventDateNew = format(eventDateObj, 'yyyy-MM-dd');
  console.log('Event Date New:', eventDateNew);
  const eventDateTime = new Date(`${eventDateNew}T${startTime}`);
  console.log('Event Date Time:', eventDateTime);

  const reminderTime = new Date(eventDateTime.getTime() - 30 * 60000); // 30 minutes before
  console.log('Reminder Time:', reminderTime);
  return reminderTime;
};

// Shows a notification with the event details
const showNotification = (event: Event): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Event Reminder', {
      body: `Your event "${event.title}" is starting in 30 minutes.`,
      icon: 'path/to/icon.png', // Optional: add an icon for the notification
    });
  } else if (Notification.permission !== 'denied') {
    console.warn('Notification permission has not been granted.');
  }
};

// Schedules a notification for an event
export const scheduleNotification = (event: Event): void => {
  const reminderTime = calculateReminderTime(event.date, event.startTime);
  const now = new Date();
  const timeUntilReminder = reminderTime.getTime() - now.getTime();

  console.log('Now:', now);
  console.log('Reminder Time:', reminderTime);
  console.log('Time Until Reminder:', timeUntilReminder);

  if (timeUntilReminder > 0) {
    const timeoutId = setTimeout(() => {
      showNotification(event);
      // Clean up the timeout ID after notification is shown
      delete notificationTimeouts[event.id];
    }, timeUntilReminder);

    // Store the timeout ID for this event
    notificationTimeouts[event.id] = timeoutId;
  } else {
    console.warn('Reminder time is in the past. Cannot schedule notification.');
  }
};

// Clears the notification for a given event
export const clearScheduledNotification = (eventId: number): void => {
  const timeoutId = notificationTimeouts[eventId];
  if (timeoutId) {
    clearTimeout(timeoutId);
    delete notificationTimeouts[eventId];
    console.log(`Notification for event ${eventId} cleared.`);
  } else {
    console.warn(`No scheduled notification found for event ${eventId}.`);
  }
};
