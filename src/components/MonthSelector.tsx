import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MonthSelector({ currentMonth, currentYear, onMonthChange }: MonthSelectorProps) {
  const handlePrevious = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        className="h-9 w-9 rounded-xl hover:bg-muted"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="min-w-[160px] text-center">
        <h2 className="text-xl font-semibold text-foreground">
          {MONTHS[currentMonth]}
        </h2>
        <p className="text-sm text-muted-foreground">{currentYear}</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="h-9 w-9 rounded-xl hover:bg-muted"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
