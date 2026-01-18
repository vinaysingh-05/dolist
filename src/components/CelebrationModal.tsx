import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star, Sparkles, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  streak: number;
  habitName: string;
  isNewRecord: boolean;
}

const MESSAGES: Record<number, { title: string; message: string; icon: typeof Trophy }> = {
  3: {
    title: "3 Days Strong! 🌱",
    message: "You're building momentum. The hardest part is over.",
    icon: Star,
  },
  7: {
    title: "One Week! 🔥",
    message: "A full week of consistency. You're making this a real habit.",
    icon: Flame,
  },
  14: {
    title: "Two Weeks! 💪",
    message: "Half a month! Your dedication is inspiring.",
    icon: Flame,
  },
  21: {
    title: "21 Days! 🧠",
    message: "They say it takes 21 days to form a habit. You did it!",
    icon: Trophy,
  },
  30: {
    title: "One Month! 🏆",
    message: "A full month of showing up. That's remarkable.",
    icon: Trophy,
  },
  60: {
    title: "60 Days! ⭐",
    message: "Two months of unstoppable consistency!",
    icon: Trophy,
  },
  90: {
    title: "90 Days! 🌟",
    message: "Three months! This is now part of who you are.",
    icon: PartyPopper,
  },
  100: {
    title: "100 Days! 💯",
    message: "Triple digits! You're absolutely incredible.",
    icon: PartyPopper,
  },
  365: {
    title: "ONE YEAR! 🎉",
    message: "365 days. You've mastered consistency itself.",
    icon: PartyPopper,
  },
};

export function CelebrationModal({
  open,
  onClose,
  streak,
  habitName,
  isNewRecord,
}: CelebrationModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (open) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [open]);

  const milestoneData = MESSAGES[streak];
  const Icon = milestoneData?.icon || Trophy;

  if (!milestoneData && !isNewRecord) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-border/50 sm:max-w-md overflow-hidden">
        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <Sparkles
              key={p.id}
              className="absolute text-primary animate-ping opacity-60"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: "1.5s",
              }}
              size={16}
            />
          ))}
        </div>

        <div className="relative text-center py-6">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center animate-check-pop glow-mint">
            <Icon className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
            {milestoneData?.title || "New Record! 🎉"}
          </h2>

          {/* Habit name */}
          <p className="text-secondary font-medium mb-4 animate-fade-in stagger-1">
            {habitName}
          </p>

          {/* Message */}
          <p className="text-muted-foreground mb-6 animate-fade-in stagger-2">
            {milestoneData?.message || `${streak} days - your longest streak ever!`}
          </p>

          {/* Streak display */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-2xl",
              "bg-gradient-to-r from-primary/20 to-secondary/20",
              "border border-primary/30 mb-6 animate-fade-in stagger-3"
            )}
          >
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-foreground">
              {streak} Day Streak
            </span>
          </div>

          {/* Close button */}
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-mint animate-fade-in stagger-4"
          >
            Keep Going! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
