import moment from "moment";

/**
 * Format date to a readable string
 */
export const formatDate = (
  date: string | Date,
  format = "DD/MM/YYYY"
): string => {
  return moment(date).format(format);
};

/**
 * Format time to a readable string
 */
export const formatTime = (time: string, format = "HH:mm"): string => {
  return moment(time, "HH:mm:ss").format(format);
};

/**
 * Format date and time together
 */
export const formatDateTime = (
  date: string | Date,
  format = "DD/MM/YYYY HH:mm"
): string => {
  return moment(date).format(format);
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
  return moment(date).isBefore(moment(), "day");
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  return moment(date).isSame(moment(), "day");
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  return moment(date).fromNow();
};

/**
 * Combine date and time strings into ISO format
 */
export const combineDateAndTime = (date: string, time: string): string => {
  return moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").toISOString();
};
