import { useState, useEffect } from "react";
import { format, differenceInWeeks, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Calculator, Timer, ArrowRight, History } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCreateLog } from "@/hooks/use-logs";
import { cn } from "@/lib/utils";

// Default start date: 2024-05-01
const DEFAULT_DATE = new Date(2024, 4, 1); // Month is 0-indexed in JS Date constructor

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [weeks, setWeeks] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const { mutate: createLog } = useCreateLog();

  // Load from local storage on mount
  useEffect(() => {
    const savedDate = localStorage.getItem("targetDate");
    if (savedDate) {
      try {
        const parsed = parseISO(savedDate);
        // Basic validation to ensure it's a valid date
        if (!isNaN(parsed.getTime())) {
          setDate(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved date", e);
      }
    }
    // Fallback if no saved date or invalid
    setDate(DEFAULT_DATE);
  }, []);

  // Save to local storage whenever date changes
  useEffect(() => {
    if (date) {
      localStorage.setItem("targetDate", date.toISOString());
    }
  }, [date]);

  const handleCalculate = () => {
    if (!date) return;

    const today = new Date();
    const diff = differenceInWeeks(today, date);
    
    setWeeks(diff);
    setIsCalculated(true);

    // Persist log to backend (fire and forget)
    createLog({
      startDate: format(date, "yyyy-MM-dd"),
      weeksResult: diff
    });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setIsCalculated(false); // Reset calculation when date changes to encourage re-calculating
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-accent/30 to-background flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-md w-full relative z-10 animate-in-slide">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-card rounded-2xl shadow-sm mb-4 border border-border/50">
            <Timer className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Week Tracker
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Track how much time has passed since your milestone.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Select a Start Date</CardTitle>
            <CardDescription>
              Choose the date you want to count weeks from.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 rounded-xl text-base border-2 hover:bg-accent/50 hover:border-primary/20 transition-all duration-300",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary/70" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-border/60" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Result Area */}
            <div className={cn(
              "transition-all duration-500 ease-out overflow-hidden bg-accent/30 rounded-2xl border border-accent/50",
              isCalculated ? "max-h-48 opacity-100 p-6" : "max-h-0 opacity-0 p-0 border-0"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Time Elapsed</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary font-mono tracking-tighter">
                      {weeks}
                    </span>
                    <span className="text-lg font-medium text-muted-foreground">
                      weeks
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 border-t border-accent/50 pt-3">
                Since {date && format(date, "MMMM do, yyyy")}
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-8">
            <Button 
              className="w-full h-14 text-lg font-semibold rounded-xl group transition-all hover:scale-[1.02] active:scale-[0.98]" 
              size="lg"
              onClick={handleCalculate}
              disabled={!date}
            >
              <Calculator className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Calculate Weeks
              <ArrowRight className="ml-auto h-5 w-5 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8 opacity-60">
          Your selected date is saved automatically for your next visit.
        </p>
      </div>
    </div>
  );
}
