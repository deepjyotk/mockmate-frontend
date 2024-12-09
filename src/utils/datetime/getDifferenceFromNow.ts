/**
 * Calculate the difference between the current time and a given UTC time.
 * @param utcTime - The target UTC time as a string or Date object.
 * @returns An object containing the difference in days, hours, minutes, and seconds.
 */
export function getTimeDifferenceFromNow(utcTime: string | Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    // Parse the provided UTC time
    const targetTime = typeof utcTime === "string" ? new Date(utcTime) : utcTime;
  
    // Get the current time
    const currentTime = new Date();
  
    // Calculate the difference in milliseconds
    const differenceInMs = targetTime.getTime() - currentTime.getTime();
  
    // Convert milliseconds to seconds
    const differenceInSeconds = Math.max(0, Math.floor(differenceInMs / 1000));
  
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(differenceInSeconds / (24 * 60 * 60));
    const hours = Math.floor((differenceInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((differenceInSeconds % (60 * 60)) / 60);
    const seconds = differenceInSeconds % 60;
  
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }
  

  /**
 * Calculate the difference in seconds between the current time and a given UTC time.
 * @param utcTime - The target UTC time as a string or Date object.
 * @returns The difference in seconds (positive if in the future, negative if in the past).
 */
export function getDifferenceInSeconds(utcTime: string | Date): number {
    // Parse the provided UTC time
    const targetTime = typeof utcTime === "string" ? new Date(utcTime) : utcTime;
  
    // Get the current time
    const currentTime = new Date();
  
    // Calculate the difference in milliseconds and convert to seconds
    const differenceInSeconds = Math.floor((targetTime.getTime() - currentTime.getTime()) / 1000);
  
    return differenceInSeconds;
  }
  