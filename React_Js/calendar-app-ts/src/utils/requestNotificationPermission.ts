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


const calculateReminderTime = (eventDate: string, startTime: string): Date => {
  const eventDateObj = new Date(eventDate);
  const eventDateNew = format(eventDateObj, 'yyyy-MM-dd');
  const eventDateTime = new Date(`${eventDateNew}T${startTime}`);
  const reminderTime = new Date(eventDateTime.getTime() - 30 * 60000); // 30 minutes before
  return reminderTime;
};

const showNotification = (event: Event): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('Event Reminder', {
      body: `Your event "${event.title}" is starting in 30 minutes.`,
      icon: 'path/to/icon.png', 
      data: event,
    });

    // Handle notification clicks
    notification.onclick = () => {
      // Send a message to the window when the notification is clicked
      window.postMessage({
        type: 'OPEN_MODAL',
        event: notification.data // Access data from notification
      }, '*');
    };
  } else if (Notification.permission !== 'denied') {
    console.warn('Notification permission has not been granted.');
  }
};

export const scheduleNotification = (event: Event): void => {
  debugger;
  const reminderTime = calculateReminderTime(event.date, event.startTime);
  const now = new Date();
  const remainderTimecalc = reminderTime.getTime();
  const nowTime= now.getTime();
  const timeUntilReminder = remainderTimecalc - nowTime;

  if (timeUntilReminder > 0) {
    const timeoutId = setTimeout(() => {
      showNotification(event);
      delete notificationTimeouts[event.id];
    }, timeUntilReminder);

    notificationTimeouts[event.id] = timeoutId;
  } else {
    console.warn('Reminder time is in the past. Cannot schedule notification.');
  }
};

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
