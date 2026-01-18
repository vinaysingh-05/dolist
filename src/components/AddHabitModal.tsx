import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Habit } from "./HabitTable";

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, "id" | "completedDays">) => void;
  editingHabit?: Habit | null;
  daysInMonth: number;
}

export function AddHabitModal({
  open,
  onClose,
  onSave,
  editingHabit,
  daysInMonth,
}: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Career" | "Health" | "Mindset">("Health");
  const [monthlyGoal, setMonthlyGoal] = useState(daysInMonth);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setCategory(editingHabit.category);
      setMonthlyGoal(editingHabit.monthlyGoal);
    } else {
      setName("");
      setCategory("Health");
      setMonthlyGoal(daysInMonth);
    }
  }, [editingHabit, daysInMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      category,
      monthlyGoal,
    });
    
    setName("");
    setCategory("Health");
    setMonthlyGoal(daysInMonth);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingHabit ? "Edit Habit" : "Add New Habit"}
          </DialogTitle>
          <DialogDescription>
            {editingHabit
              ? "Update your habit details below."
              : "Create a new habit to track this month."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning meditation"
              className="h-11 rounded-xl bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
              <SelectTrigger className="h-11 rounded-xl bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-border">
                <SelectItem value="Health">🏃 Health</SelectItem>
                <SelectItem value="Career">💼 Career</SelectItem>
                <SelectItem value="Mindset">🧘 Mindset</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Monthly Goal (days)</Label>
            <Input
              id="goal"
              type="number"
              min={1}
              max={daysInMonth}
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(Number(e.target.value))}
              className="h-11 rounded-xl bg-input border-border"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editingHabit ? "Save Changes" : "Add Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
