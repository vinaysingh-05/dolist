import { useMemo } from "react";
import { Habit } from "./HabitTable";

interface CategoryChartProps {
  habits: Habit[];
}

const categoryConfig = {
  Career: { color: "hsl(200 80% 60%)", label: "Career" },
  Health: { color: "hsl(150 100% 50%)", label: "Health" },
  Mindset: { color: "hsl(265 95% 76%)", label: "Mindset" },
};

export function CategoryChart({ habits }: CategoryChartProps) {
  const data = useMemo(() => {
    const counts = {
      Career: 0,
      Health: 0,
      Mindset: 0,
    };
    
    habits.forEach((habit) => {
      counts[habit.category]++;
    });
    
    const total = habits.length || 1;
    
    return Object.entries(counts).map(([category, count]) => ({
      category: category as keyof typeof categoryConfig,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }, [habits]);

  const total = habits.length;
  let cumulativePercentage = 0;

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in stagger-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Habit Categories
      </h3>
      
      {total > 0 ? (
        <>
          {/* Pie Chart */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
              {data.map((item) => {
                const startAngle = cumulativePercentage * 3.6;
                const dashArray = `${item.percentage} ${100 - item.percentage}`;
                const rotation = cumulativePercentage * 3.6;
                cumulativePercentage += item.percentage;
                
                if (item.count === 0) return null;
                
                return (
                  <circle
                    key={item.category}
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke={categoryConfig[item.category].color}
                    strokeWidth="6"
                    strokeDasharray={dashArray}
                    strokeDashoffset="0"
                    className="transition-all duration-1000"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: "center",
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">{total}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryConfig[item.category].color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {categoryConfig[item.category].label}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Add habits to see distribution
          </p>
        </div>
      )}
    </div>
  );
}
