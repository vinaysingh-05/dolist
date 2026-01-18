import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { WelcomeCard } from "@/components/WelcomeCard";
import { MonthSelector } from "@/components/MonthSelector";
import { ProgressRing } from "@/components/ui/progress-ring";
import { HabitTable, Habit } from "@/components/HabitTable";
import { ConsistencyChart } from "@/components/ConsistencyChart";
import { CategoryChart } from "@/components/CategoryChart";
import { AddHabitModal } from "@/components/AddHabitModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { NewMonthModal } from "@/components/NewMonthModal";
import { StreakBadge } from "@/components/StreakBadge";
import { CelebrationModal } from "@/components/CelebrationModal";
import { calculateStreak, checkMilestone, MILESTONES } from "@/lib/streaks";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [showNewMonthModal, setShowNewMonthModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    streak: number;
    habitName: string;
    isNewRecord: boolean;
  }>({ show: false, streak: 0, habitName: "", isNewRecord: false });
  
  const previousStreaksRef = useRef<Record<string, number>>({});

  const currentDay = useMemo(() => {
    if (currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
      return now.getDate();
    }
    return 0;
  }, [currentMonth, currentYear]);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  const totalProgress = useMemo(() => {
    if (habits.length === 0) return 0;
    const totalGoal = habits.reduce((sum, h) => sum + h.monthlyGoal, 0);
    const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0);
    return Math.round((totalCompleted / totalGoal) * 100);
  }, [habits]);

  // Calculate best current streak across all habits
  const bestStreak = useMemo(() => {
    let best = { current: 0, longest: 0 };
    habits.forEach((habit) => {
      const streak = calculateStreak(habit.completedDays, currentDay, daysInMonth);
      if (streak.currentStreak > best.current) {
        best.current = streak.currentStreak;
      }
      const longest = habit.longestStreak || streak.longestStreak;
      if (longest > best.longest) {
        best.longest = longest;
      }
    });
    return best;
  }, [habits, currentDay, daysInMonth]);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const guestMode = localStorage.getItem("hitlist-guest");
      if (guestMode) {
        setIsGuest(true);
        loadGuestHabits();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !localStorage.getItem("hitlist-guest")) {
        navigate("/login");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load guest habits from localStorage
  const loadGuestHabits = () => {
    const key = `hitlist-habits-${currentYear}-${currentMonth}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setHabits(JSON.parse(saved));
    } else {
      setHabits([]);
    }
  };

  // Save guest habits to localStorage
  const saveGuestHabits = (newHabits: Habit[]) => {
    const key = `hitlist-habits-${currentYear}-${currentMonth}`;
    localStorage.setItem(key, JSON.stringify(newHabits));
    setHabits(newHabits);
  };

  // Load habits when month changes (for guest mode)
  useEffect(() => {
    if (isGuest) {
      loadGuestHabits();
    }
  }, [currentMonth, currentYear, isGuest]);

  const handleMonthChange = (month: number, year: number) => {
    const wasNewMonth = month !== currentMonth || year !== currentYear;
    setCurrentMonth(month);
    setCurrentYear(year);
    
    // Check if switching to a new month that has no habits
    if (wasNewMonth && isGuest) {
      const key = `hitlist-habits-${year}-${month}`;
      const saved = localStorage.getItem(key);
      if (!saved && habits.length > 0) {
        setShowNewMonthModal(true);
      }
    }
  };

  const handleStartFresh = () => {
    setHabits([]);
    setShowNewMonthModal(false);
  };

  const handleReuseHabits = () => {
    // Copy habits but reset completed days
    const reusedHabits = habits.map(h => ({
      ...h,
      id: crypto.randomUUID(),
      completedDays: [],
    }));
    saveGuestHabits(reusedHabits);
    setShowNewMonthModal(false);
  };

  const handleAddHabit = (habitData: Omit<Habit, "id" | "completedDays">) => {
    if (editingHabit) {
      const updated = habits.map(h =>
        h.id === editingHabit.id
          ? { ...h, ...habitData }
          : h
      );
      saveGuestHabits(updated);
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        ...habitData,
        id: crypto.randomUUID(),
        completedDays: [],
      };
      saveGuestHabits([...habits, newHabit]);
    }
    
    toast({
      title: editingHabit ? "Habit updated" : "Habit added 🌱",
      description: editingHabit ? "Your changes have been saved." : "Keep showing up!",
    });
  };

  const handleToggleDay = (habitId: string, day: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompleting = !habit.completedDays.includes(day);
    const previousStreak = previousStreaksRef.current[habitId] || 0;

    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      
      const newCompletedDays = isCompleting
        ? [...h.completedDays, day]
        : h.completedDays.filter(d => d !== day);
      
      // Update longest streak if needed
      const newStreakData = calculateStreak(newCompletedDays, currentDay, daysInMonth);
      const newLongestStreak = Math.max(h.longestStreak || 0, newStreakData.longestStreak);

      return {
        ...h,
        completedDays: newCompletedDays,
        longestStreak: newLongestStreak,
      };
    });

    // Check for milestone or record
    if (isCompleting) {
      const updatedHabit = updated.find(h => h.id === habitId);
      if (updatedHabit) {
        const newStreakData = calculateStreak(updatedHabit.completedDays, currentDay, daysInMonth);
        const milestone = checkMilestone(previousStreak, newStreakData.currentStreak);
        const isRecord = newStreakData.currentStreak > previousStreak && 
                         newStreakData.currentStreak > (habit.longestStreak || 0);

        if (milestone || isRecord) {
          setCelebration({
            show: true,
            streak: newStreakData.currentStreak,
            habitName: habit.name,
            isNewRecord: isRecord && !milestone,
          });
        }

        // Update previous streak ref
        previousStreaksRef.current[habitId] = newStreakData.currentStreak;
      }
    }

    saveGuestHabits(updated);
  };

  // Initialize previous streaks ref
  useEffect(() => {
    const streaks: Record<string, number> = {};
    habits.forEach((habit) => {
      const streak = calculateStreak(habit.completedDays, currentDay, daysInMonth);
      streaks[habit.id] = streak.currentStreak;
    });
    previousStreaksRef.current = streaks;
  }, [habits.length]);

  const handleDeleteConfirm = () => {
    if (!deletingHabitId) return;
    const updated = habits.filter(h => h.id !== deletingHabitId);
    saveGuestHabits(updated);
    setDeletingHabitId(null);
    toast({
      title: "Habit removed",
      description: "You can always add it back later.",
    });
  };

  const handleLogout = async () => {
    if (isGuest) {
      localStorage.removeItem("hitlist-guest");
      navigate("/");
      return;
    }
    
    await supabase.auth.signOut();
    navigate("/");
  };

  const deletingHabit = habits.find(h => h.id === deletingHabitId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-mint">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HITLIST</span>
            </div>
            
            <div className="flex items-center gap-4">
              <MonthSelector
                currentMonth={currentMonth}
                currentYear={currentYear}
                onMonthChange={handleMonthChange}
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 rounded-xl hover:bg-muted"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <WelcomeCard habitsCount={habits.length} />
          </div>
          
          {/* Progress Ring */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center animate-fade-in stagger-1">
            <ProgressRing progress={totalProgress} size={120} strokeWidth={8} />
            <p className="mt-3 text-sm text-muted-foreground">Monthly Progress</p>
          </div>

          {/* Best Streak */}
          <div className="animate-fade-in stagger-2">
            <StreakBadge
              currentStreak={bestStreak.current}
              longestStreak={bestStreak.longest}
            />
          </div>
        </div>

        {/* Add Habit Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-mint"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Habit
          </Button>
        </div>

        {/* Habit Table */}
        <HabitTable
          habits={habits}
          daysInMonth={daysInMonth}
          currentDay={currentDay}
          onToggleDay={handleToggleDay}
          onEdit={(habit) => {
            setEditingHabit(habit);
            setIsAddModalOpen(true);
          }}
          onDelete={setDeletingHabitId}
        />

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConsistencyChart
            habits={habits}
            daysInMonth={daysInMonth}
            currentDay={currentDay}
          />
          <CategoryChart habits={habits} />
        </div>
      </main>

      {/* Modals */}
      <AddHabitModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleAddHabit}
        editingHabit={editingHabit}
        daysInMonth={daysInMonth}
      />

      <DeleteConfirmModal
        open={!!deletingHabitId}
        habitName={deletingHabit?.name || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingHabitId(null)}
      />

      <NewMonthModal
        open={showNewMonthModal}
        monthName={MONTHS[currentMonth]}
        onStartFresh={handleStartFresh}
        onReuseHabits={handleReuseHabits}
      />

      <CelebrationModal
        open={celebration.show}
        onClose={() => setCelebration({ ...celebration, show: false })}
        streak={celebration.streak}
        habitName={celebration.habitName}
        isNewRecord={celebration.isNewRecord}
      />
    </div>
  );
}
