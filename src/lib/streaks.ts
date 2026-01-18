/**
 * Calculate streak data for a habit based on completed days
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDay: number | null;
}

export function calculateStreak(
  completedDays: number[],
  currentDay: number,
  daysInMonth: number
): StreakData {
  if (completedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDay: null };
  }

  // Sort days in ascending order
  const sortedDays = [...completedDays].sort((a, b) => a - b);
  
  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] + 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  // Calculate current streak (must be connected to today or yesterday)
  let currentStreak = 0;
  const lastDay = sortedDays[sortedDays.length - 1];
  
  // Current streak is valid if last completed day is today or yesterday
  if (lastDay >= currentDay - 1) {
    currentStreak = 1;
    
    // Count backwards from the last completed day
    for (let i = sortedDays.length - 2; i >= 0; i--) {
      if (sortedDays[i] === sortedDays[i + 1] - 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    lastCompletedDay: lastDay,
  };
}

/**
 * Check if a streak just hit a milestone
 */
export const MILESTONES = [3, 7, 14, 21, 30, 60, 90, 100, 365];

export function checkMilestone(
  previousStreak: number,
  newStreak: number
): number | null {
  for (const milestone of MILESTONES) {
    if (previousStreak < milestone && newStreak >= milestone) {
      return milestone;
    }
  }
  return null;
}

/**
 * Check if this is a new record
 */
export function isNewRecord(
  currentStreak: number,
  longestStreak: number,
  previousLongest: number
): boolean {
  return currentStreak > 0 && longestStreak > previousLongest;
}
