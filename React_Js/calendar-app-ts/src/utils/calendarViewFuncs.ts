 import { format, addHours } from 'date-fns';
 import { Event } from '../utils/types';
 
 
 // Helper function to convert 'HH:mm' string to total minutes since midnight
 const convertTimeStringToMinutes = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to determine how many intervals an event spans
  export const getIntervalsOccupiedByEvent = (event: Event, intervals: Date[]) => {
    const eventStart = convertTimeStringToMinutes(event.startTime);
    const eventEnd = convertTimeStringToMinutes(event.endTime);

    // Count how many intervals are covered by the event
    return intervals.filter(interval => {
      const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
      const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

      return eventStart < nextIntervalStart && eventEnd > intervalStart;
    }).length;
  };

  // Function to sort events based on the intervals they occupy
  export const  sortEventsByIntervals = (events: Event[], intervals: Date[]): Event[] => {
    return [...events].sort((a, b) => {
      const intervalsOccupiedA = getIntervalsOccupiedByEvent(a, intervals);
      const intervalsOccupiedB = getIntervalsOccupiedByEvent(b, intervals);
      return intervalsOccupiedB - intervalsOccupiedA; // Sort in descending order
    });
  }

 
 // Function to determine if an event overlaps with a given interval
 export const doesEventOverlapWithInterval = (event: Event, interval: Date) => {
    const eventStart = convertTimeStringToMinutes(event.startTime);
    const eventEnd = convertTimeStringToMinutes(event.endTime);
    const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
    const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

    // Check if event starts before the end of this interval and ends after the start of this interval
    return eventStart < nextIntervalStart && eventEnd > intervalStart;
  };

  // Calculate the position and height for an event in a given interval
  export const calculateEventPositionInInterval = (event: Event, interval: Date) => {
    const eventStart = convertTimeStringToMinutes(event.startTime);
    const eventEnd = convertTimeStringToMinutes(event.endTime);
    const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
    const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

    // Determine the visible start and end within this interval
    const visibleStart = Math.max(eventStart, intervalStart);
    const visibleEnd = Math.min(eventEnd, nextIntervalStart);

    // Calculate top position and height in pixels (1 minute = 2 pixels)
    const pixelsPerMinute = 1;
    const topPosition = (visibleStart - intervalStart) * pixelsPerMinute;
    const eventHeight = (visibleEnd - visibleStart) * pixelsPerMinute;
    debugger

    return { topPosition, eventHeight };
  };