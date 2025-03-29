/**
 * Format a date string to a human-readable format
 * @param dateStr - Date string in format YYYY-MM-DD
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

/**
 * Format a time string to a human-readable format
 * @param timeStr - Time string in format HH:MM:SS
 * @returns Formatted time string
 */
export const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';

  try {
    // If timeStr is just the time portion (HH:MM:SS), create a full date string
    let fullTimeStr = timeStr;
    if (timeStr.length <= 8) {
      fullTimeStr = `2000-01-01T${timeStr}`;
    }

    const date = new Date(fullTimeStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr;
  }
};
