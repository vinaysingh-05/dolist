import { Pencil, Trash2, Check, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StreakBadge } from "./StreakBadge";
import { calculateStreak } from "@/lib/streaks";

export interface Habit {
  id: string;
  name: string;
  category: "Career" | "Health" | "Mindset";
  monthlyGoal: number;
  completedDays: number[];
  longestStreak?: number;
}

interface HabitTableProps {
  habits: Habit[];
  daysInMonth: number;
  currentDay: number;
  onToggleDay: (habitId: string, day: number) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const categoryColors = {
  Career: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Health: "bg-primary/20 text-primary border-primary/30",
  Mindset: "bg-secondary/20 text-secondary border-secondary/30",
};

export function HabitTable({
  habits,
  daysInMonth,
  currentDay,
  onToggleDay,
  onEdit,
  onDelete,
}: HabitTableProps) {
  const getStatus = (habit: Habit) => {
    const progress = (habit.completedDays.length / habit.monthlyGoal) * 100;
    if (progress >= 100) return "Completed";
    return "In Progress";
  };

  const getProgress = (habit: Habit) => {
    return Math.min(100, Math.round((habit.completedDays.length / habit.monthlyGoal) * 100));
  };

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fade-in stagger-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card/90 backdrop-blur-sm z-10">
                Habit
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Category
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4" />
                  Streak
                </div>
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                Goal
              </th>
              {Array.from({ length: Math.min(daysInMonth, 31) }, (_, i) => (
                <th
                  key={i + 1}
                  className={cn(
                    "text-center p-2 text-xs font-medium min-w-[32px]",
                    i + 1 === currentDay
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {i + 1}
                </th>
              ))}
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground sticky right-0 bg-card/90 backdrop-blur-sm z-10">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => {
              const streakData = calculateStreak(habit.completedDays, currentDay, daysInMonth);
              
              return (
              <tr
                key={habit.id}
                className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="p-4 font-medium text-foreground sticky left-0 bg-card/90 backdrop-blur-sm z-10">
                  {habit.name}
                </td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-lg border",
                      categoryColors[habit.category]
                    )}
                  >
                    {habit.category}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  <StreakBadge
                    currentStreak={streakData.currentStreak}
                    longestStreak={habit.longestStreak || streakData.longestStreak}
                    compact
                  />
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm text-muted-foreground">
                    {habit.completedDays.length}/{habit.monthlyGoal}
                  </span>
                </td>
                {Array.from({ length: Math.min(daysInMonth, 31) }, (_, i) => {
                  const day = i + 1;
                  const isCompleted = habit.completedDays.includes(day);
                  const isToday = day === currentDay;
                  const isFuture = day > currentDay;

                  return (
                    <td key={day} className="p-1 text-center">
                      <button
                        onClick={() => !isFuture && onToggleDay(habit.id, day)}
                        disabled={isFuture}
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
                          isCompleted
                            ? "bg-primary text-primary-foreground glow-mint"
                            : isToday
                            ? "bg-muted border-2 border-primary/50 hover:bg-primary/20"
                            : isFuture
                            ? "bg-muted/30 cursor-not-allowed"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {isCompleted && (
                          <Check className="w-4 h-4 animate-check-pop" />
                        )}
                      </button>
                    </td>
                  );
                })}
                <td className="p-4 text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-lg",
                      getStatus(habit) === "Completed"
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {getStatus(habit)}
                  </Badge>
                </td>
                <td className="p-4 sticky right-0 bg-card/90 backdrop-blur-sm z-10">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(habit)}
                      className="h-8 w-8 rounded-lg hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(habit.id)}
                      className="h-8 w-8 rounded-lg hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      
      {habits.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">
            No habits yet. Add your first habit to get started.
          </p>
        </div>
      )}
    </div>
  );
}
