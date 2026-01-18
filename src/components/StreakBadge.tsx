import { Flame, Trophy, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  showCelebration?: boolean;
  compact?: boolean;
}

const MILESTONES = [3, 7, 14, 21, 30, 60, 90, 100, 365];

export function StreakBadge({
  currentStreak,
  longestStreak,
  showCelebration = false,
  compact = false,
}: StreakBadgeProps) {
  const [celebrating, setCelebrating] = useState(false);

  const isMilestone = MILESTONES.includes(currentStreak);
  const isNewRecord = currentStreak > 0 && currentStreak >= longestStreak;

  useEffect(() => {
    if (showCelebration && (isMilestone || isNewRecord)) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, isMilestone, isNewRecord, currentStreak]);

  const getStreakColor = () => {
    if (currentStreak >= 30) return "text-primary";
    if (currentStreak >= 14) return "text-secondary";
    if (currentStreak >= 7) return "text-chart-4";
    return "text-muted-foreground";
  };

  const getStreakIcon = () => {
    if (currentStreak >= 30) return Trophy;
    if (currentStreak >= 7) return Flame;
    return Star;
  };

  const Icon = getStreakIcon();

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-lg transition-all",
          currentStreak > 0 ? "bg-primary/10" : "bg-muted/50",
          celebrating && "animate-check-pop"
        )}
      >
        <Icon className={cn("w-3.5 h-3.5", getStreakColor())} />
        <span className={cn("text-xs font-medium", getStreakColor())}>
          {currentStreak}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Celebration particles */}
      {celebrating && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(8)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-primary animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.8s",
              }}
              size={12}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          "glass rounded-2xl p-4 transition-all duration-300",
          celebrating && "glow-mint animate-pulse-glow"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Current Streak */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                currentStreak > 0
                  ? "bg-primary/20"
                  : "bg-muted",
                celebrating && "animate-check-pop"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all",
                  getStreakColor(),
                  currentStreak >= 7 && "animate-float"
                )}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className={cn("text-2xl font-bold", getStreakColor())}>
                {currentStreak} {currentStreak === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Longest</p>
            <p className="text-lg font-semibold text-foreground">
              {longestStreak} days
            </p>
            {isNewRecord && currentStreak > 0 && (
              <span className="text-xs text-primary font-medium animate-pulse">
                🎉 New record!
              </span>
            )}
          </div>
        </div>

        {/* Milestone progress */}
        {currentStreak > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Next milestone</span>
              <span>
                {MILESTONES.find((m) => m > currentStreak) || "∞"} days
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 glow-mint"
                style={{
                  width: `${Math.min(
                    100,
                    (currentStreak /
                      (MILESTONES.find((m) => m > currentStreak) || 365)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
