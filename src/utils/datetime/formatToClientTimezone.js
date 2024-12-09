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