import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  currentMonth: string;
  currentYear: number;
  onMonthChange: (month: string, year: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthSelector({ currentMonth, currentYear, onMonthChange }: MonthSelectorProps) {
  const currentMonthIndex = MONTHS.indexOf(currentMonth);
  
  const goToPreviousMonth = () => {
    let newMonthIndex = currentMonthIndex - 1;
    let newYear = currentYear;
    
    if (newMonthIndex < 0) {
      newMonthIndex = 11;
      newYear -= 1;
    }
    
    const monthName = MONTHS[newMonthIndex];
    if (monthName) {
      onMonthChange(monthName, newYear);
    }
  };
  
  const goToNextMonth = () => {
    let newMonthIndex = currentMonthIndex + 1;
    let newYear = currentYear;
    
    if (newMonthIndex > 11) {
      newMonthIndex = 0;
      newYear += 1;
    }
    
    const monthName = MONTHS[newMonthIndex];
    if (monthName) {
      onMonthChange(monthName, newYear);
    }
  };
  
  const goToCurrentMonth = () => {
    const now = new Date();
    const currentMonthName = MONTHS[now.getMonth()];
    if (currentMonthName) {
      onMonthChange(currentMonthName, now.getFullYear());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
        <Calendar className="h-4 w-4" />
        <span className="font-medium">
          {currentMonth} {currentYear}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToCurrentMonth}
      >
        Today
      </Button>
    </div>
  );
}
