import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { fetchAvailableTimeSlots, formatLocalDateIso } from "@/api/bankingApi";

interface DateTimeSelectorProps {
  branchId: number | null;
  serviceId: number | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string | null) => void;
}

export function DateTimeSelector({
  branchId,
  serviceId,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectorProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const onTimeSelectRef = useRef(onTimeSelect);
  onTimeSelectRef.current = onTimeSelect;

  useEffect(() => {
    if (!selectedDate || branchId == null || serviceId == null) {
      setSlots([]);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    fetchAvailableTimeSlots(branchId, serviceId, formatLocalDateIso(selectedDate))
      .then((list) => {
        if (!cancelled) {
          setSlots(list);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setSlots([]);
          setLoadError(err instanceof Error ? err.message : "Could not load time slots.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [branchId, serviceId, selectedDate]);

  useEffect(() => {
    if (selectedTime && slots.length > 0 && !slots.includes(selectedTime)) {
      onTimeSelectRef.current(null);
    }
  }, [slots, selectedTime]);

  const needsBranchOrService = branchId == null || serviceId == null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select Date & Time
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred appointment date and time slot
        </p>
      </div>

      {needsBranchOrService && (
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Please complete the previous steps (service and branch) before choosing a time.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="size-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Select Date
            </h3>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => {
              if (date) {
                onDateSelect(date);
              }
            }}
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            className="rounded-md border-0"
          />
        </Card>

        <Card className="p-4 border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Available Time Slots
          </h3>
          {!selectedDate ? (
            <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400 text-sm">
              Please select a date first
            </div>
          ) : needsBranchOrService ? (
            <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400 text-sm text-center px-2">
              Select a branch in the previous step to see available times.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400 text-sm">
              Loading available slots…
            </div>
          ) : loadError ? (
            <div className="flex items-center justify-center h-[350px] text-red-600 dark:text-red-400 text-sm text-center px-2">
              {loadError}
            </div>
          ) : slots.length === 0 ? (
            <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400 text-sm text-center px-2">
              No open slots on this date. Please choose another day.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeSelect(slot)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === slot
                      ? "bg-green-600 dark:bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
