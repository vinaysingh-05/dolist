import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface NewMonthModalProps {
  open: boolean;
  onStartFresh: () => void;
  onReuseHabits: () => void;
  monthName: string;
}

export function NewMonthModal({ open, onStartFresh, onReuseHabits, monthName }: NewMonthModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="glass-strong border-border/50 sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 w-fit animate-float">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-center">
            New month, fresh energy 🌱
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Ready to set your focus for {monthName}?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-col mt-6">
          <Button
            onClick={onStartFresh}
            className="w-full h-12 text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-mint"
          >
            Start Fresh
          </Button>
          <Button
            variant="ghost"
            onClick={onReuseHabits}
            className="w-full h-10 text-muted-foreground hover:text-foreground"
          >
            Reuse selected habits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
