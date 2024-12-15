import { format, fromZonedTime, toDate, zonedTimeToUtc } from "date-fns-tz";
import { parse} from "date-fns";
import { DateTime } from 'luxon';

import { toZonedTime } from "date-fns-tz";

/**
 * Convert UTC datetime to client's timezone and format.
 * @param utcDate - The UTC datetime string from the backend.
 * @param clientTimeZone - The client's timezone (e.g., 'America/New_York').
 * @returns Formatted date string in "27th Aug, 2:00PM" format.
 */
export const formatToClientTimezone = (utcDate) => {
    const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Detect client's timezone

  // Parse the UTC date string into a Date object
  const date = toDate(utcDate, { timeZone: "UTC" });

  // Convert the Date object to the client's timezone and format it
  return format(date, "do MMM, h:mmaaa", { timeZone: clientTimeZone });
};

export function convertUTCToLocalTime(utcTime: string): string {
  try {
      // Parse the UTC time string into a Date object
      const date = new Date(utcTime);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
      }

      // Format the month as a short name
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];

      // Format the day with appropriate suffix
      const day = date.getDate();
      const daySuffix = (day % 10 === 1 && day !== 11) ? 'st' : 
                        (day % 10 === 2 && day !== 12) ? 'nd' : 
                        (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

      // Format the year
      const year = date.getFullYear();

      // Format the time in 12-hour format with AM/PM
      const hours = date.getHours();
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';

      // Combine the formatted date and time into a single string
      const localDateTime: string = `${month} ${day}${daySuffix}, ${year}   ${formattedHours}${period}`;
      console.log(localDateTime); // October 21st, 2024 4PM

      return localDateTime;
  } catch (error) {
      console.error("Error converting UTC to local time:", error);
      return "Invalid date";
  }
}

export const convertToUTC = (clientDate) => {
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Remove ordinal suffix (e.g., 'th', 'st', 'nd', 'rd')
  const cleanedDate = clientDate.replace(/(th|st|nd|rd)/, "");

  // Parse the date string in the client's timezone
  const dateTime = DateTime.fromFormat(cleanedDate, "d MMM, h:mma", { zone: clientTimeZone });

  // Convert to UTC and format as ISO string
  const utcDateTime = dateTime.toUTC();
  const isoString = utcDateTime.toISO();

  return isoString;
};