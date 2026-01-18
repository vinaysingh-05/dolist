import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
  userName?: string;
  habitsCount: number;
}

export function WelcomeCard({ userName, habitsCount }: WelcomeCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMessage = () => {
    if (habitsCount === 0) {
      return "Start your journey. Add your first habit.";
    }
    if (habitsCount === 1) {
      return "Just focus on one habit today.";
    }
    return `You have ${habitsCount} habits to nurture today.`;
  };

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 glow-mint">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {getGreeting()}{userName ? `, ${userName}` : ""} 🌱
          </h2>
          <p className="text-muted-foreground">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
}
