import { useMemo } from "react";
import { Habit } from "./HabitTable";

interface ConsistencyChartProps {
  habits: Habit[];
  daysInMonth: number;
  currentDay: number;
}

export function ConsistencyChart({ habits, daysInMonth, currentDay }: ConsistencyChartProps) {
  const dailyData = useMemo(() => {
    const data = [];
    for (let day = 1; day <= Math.min(daysInMonth, currentDay); day++) {
      const completedHabits = habits.filter((h) =>
        h.completedDays.includes(day)
      ).length;
      const percentage = habits.length > 0
        ? Math.round((completedHabits / habits.length) * 100)
        : 0;
      data.push({ day, percentage });
    }
    return data;
  }, [habits, daysInMonth, currentDay]);

  const maxHeight = 80;

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in stagger-3">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Daily Consistency
      </h3>
      
      <div className="flex items-end gap-1 h-24">
        {dailyData.map((data, index) => (
          <div
            key={data.day}
            className="flex-1 flex flex-col items-center group"
          >
            <div
              className="w-full rounded-t-sm bg-primary/80 transition-all duration-300 hover:bg-primary origin-bottom animate-bar-grow"
              style={{
                height: `${(data.percentage / 100) * maxHeight}px`,
                minHeight: data.percentage > 0 ? "4px" : "0px",
                animationDelay: `${index * 0.03}s`,
                boxShadow: data.percentage > 50 ? "0 0 8px hsl(150 100% 50% / 0.4)" : "none",
              }}
            />
            <span className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {data.percentage}%
            </span>
          </div>
        ))}
        
        {/* Empty bars for future days */}
        {Array.from({ length: daysInMonth - currentDay }, (_, i) => (
          <div
            key={`future-${i}`}
            className="flex-1 flex flex-col items-center"
          >
            <div
              className="w-full rounded-t-sm bg-muted/30"
              style={{ height: "4px" }}
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>1</span>
        <span>{Math.ceil(daysInMonth / 2)}</span>
        <span>{daysInMonth}</span>
      </div>
    </div>
  );
}
