// utils/timeUtils.ts

/**
 * Get the user's current timezone using the browser's Intl API.
 * Example return: "America/Los_Angeles"
 */
export function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  /**
   * Format a UTC date/time into the user's local time using a specific timezone.
   * Returns formatted string like: "04/07/2025, 08:00 AM"
   *
   * @param utcTime - ISO date string or Date object in UTC
   * @param timeZone - IANA timezone string (e.g., "America/Los_Angeles")
   */
  export function formatToLocalTime(
    utcTime: string | Date,
    timeZone: string
  ): string {
    const date = new Date(utcTime);
    return date.toLocaleString("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }
  
  /**
   * Converts a local Date object into an ISO UTC string.
   * Example: "2025-04-07T15:00:00.000Z"
   *
   * @param localDate - Date object created in user's local timezone
   */
  export function convertLocalToUTC(localDate: Date): string {
    return localDate.toISOString();
  }
  
  /**
   * Utility to check if a given string looks like a valid date.
   */
  export function isValidDateString(dateString: string): boolean {
    return !isNaN(new Date(dateString).getTime());
  }

  export const toLocalDatetimeInputValue = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  };