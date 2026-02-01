import { useState, useEffect, useCallback } from "react";
import { format, differenceInWeeks, differenceInDays, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, Timer, History } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "weekCalc_startDate";
const DEFAULT_START_DATE = new Date(2024, 4, 1);

function formatDateForInput(date: Date | undefined): string {
  if (!date) return "";
  return format(date, "MM/dd/yyyy");
}

function parseDateFromInput(text: string): Date | null {
  if (!text.trim()) return null;
  
  const parsed = parse(text.trim(), "MM/dd/yyyy", new Date());
  if (isValid(parsed)) return parsed;
  
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const isoParsed = new Date(text);
    if (isValid(isoParsed)) return isoParsed;
  }
  
  return null;
}

export default function Home() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startDateText, setStartDateText] = useState("");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endDateText, setEndDateText] = useState("");
  const [weeks, setWeeks] = useState<number | null>(null);
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [extraDays, setExtraDays] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const calculateWeeks = useCallback(() => {
    setError(null);
    
    if (!startDate) {
      setWeeks(null);
      setTotalDays(null);
      return;
    }

    const end = endDate || new Date();
    
    if (startDate > end) {
      setError("Start date must be before end date");
      setWeeks(null);
      setTotalDays(null);
      return;
    }

    const days = differenceInDays(end, startDate);
    const weeksDiff = Math.floor(days / 7);
    const remaining = days % 7;
    
    setWeeks(weeksDiff);
    setTotalDays(days);
    setExtraDays(remaining);
  }, [startDate, endDate]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let initialDate = DEFAULT_START_DATE;
    
    if (saved) {
      try {
        const parsed = new Date(saved);
        if (isValid(parsed)) {
          initialDate = parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved date", e);
      }
    }
    
    setStartDate(initialDate);
    setStartDateText(formatDateForInput(initialDate));
    
    const today = new Date();
    setEndDate(today);
    setEndDateText(formatDateForInput(today));
  }, []);

  useEffect(() => {
    if (startDate && isValid(startDate)) {
      localStorage.setItem(STORAGE_KEY, startDate.toISOString());
    }
  }, [startDate]);

  useEffect(() => {
    calculateWeeks();
  }, [calculateWeeks]);

  const handleStartDateCalendarSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateText(formatDateForInput(date));
  };

  const handleStartDateTextChange = (value: string) => {
    setStartDateText(value);
    const parsed = parseDateFromInput(value);
    if (parsed) {
      setStartDate(parsed);
    }
  };

  const handleStartDateTextBlur = () => {
    const parsed = parseDateFromInput(startDateText);
    if (parsed) {
      setStartDate(parsed);
      setStartDateText(formatDateForInput(parsed));
    } else if (startDate) {
      setStartDateText(formatDateForInput(startDate));
    }
  };

  const handleEndDateCalendarSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateText(formatDateForInput(date));
  };

  const handleEndDateTextChange = (value: string) => {
    setEndDateText(value);
    const parsed = parseDateFromInput(value);
    if (parsed) {
      setEndDate(parsed);
    } else if (value === "") {
      setEndDate(undefined);
    }
  };

  const handleEndDateTextBlur = () => {
    const parsed = parseDateFromInput(endDateText);
    if (parsed) {
      setEndDate(parsed);
      setEndDateText(formatDateForInput(parsed));
    } else if (endDateText === "") {
      const today = new Date();
      setEndDate(today);
      setEndDateText(formatDateForInput(today));
    } else if (endDate) {
      setEndDateText(formatDateForInput(endDate));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-accent/30 to-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 space-y-2">
          <h1 data-testid="text-title" className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Week Calculator
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Calculate the weeks between two dates
          </p>
        </div>

        {weeks !== null && !error && (
          <div className="bg-accent/30 rounded-2xl border border-accent/50 p-6 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Time Elapsed</p>
                <div className="flex items-baseline gap-2">
                  <span data-testid="text-weeks-result" className="text-5xl font-bold text-primary font-mono tracking-tighter">
                    {weeks}
                  </span>
                  <span className="text-lg font-medium text-muted-foreground">
                    weeks
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <History className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-3 pt-3 border-t border-accent/50 space-y-1">
              <p data-testid="text-date-range">
                From {startDate && format(startDate, "MMMM d, yyyy")} to {endDate ? format(endDate, "MMMM d, yyyy") : format(new Date(), "MMMM d, yyyy")}
              </p>
              {totalDays !== null && (
                <p data-testid="text-total-days" className="text-xs">
                  {totalDays} total days{extraDays > 0 && ` (${extraDays} extra day${extraDays > 1 ? 's' : ''})`}
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div data-testid="text-error" className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <Card className="border-border/60 shadow-xl bg-card/80 backdrop-blur-sm overflow-visible">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Date Range</CardTitle>
            <CardDescription>
              Enter dates as MM/DD/YYYY or use the calendar picker
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="startDateText" className="text-sm font-medium">
                Start Date
              </Label>
              <div className="flex gap-2">
                <Input
                  id="startDateText"
                  data-testid="input-start-date"
                  type="text"
                  placeholder="MM/DD/YYYY"
                  value={startDateText}
                  onChange={(e) => handleStartDateTextChange(e.target.value)}
                  onBlur={handleStartDateTextBlur}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      data-testid="button-start-calendar"
                      className={cn(
                        "shrink-0",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-border/60" align="end">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      defaultMonth={startDate}
                      onSelect={handleStartDateCalendarSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground">This date is saved for your next visit</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDateText" className="text-sm font-medium">
                End Date <span className="text-muted-foreground font-normal">(defaults to today)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="endDateText"
                  data-testid="input-end-date"
                  type="text"
                  placeholder="MM/DD/YYYY"
                  value={endDateText}
                  onChange={(e) => handleEndDateTextChange(e.target.value)}
                  onBlur={handleEndDateTextBlur}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      data-testid="button-end-calendar"
                      className={cn(
                        "shrink-0",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-border/60" align="end">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      defaultMonth={endDate}
                      onSelect={handleEndDateCalendarSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
