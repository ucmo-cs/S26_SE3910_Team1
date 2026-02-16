import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  availableSlots: string[];
}

export function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  availableSlots,
}: DateTimeSelectorProps) {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
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
            onSelect={(date) => date && onDateSelect(date)}
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
            className="rounded-md border-0"
          />
        </Card>

        {/* Time Slots */}
        <Card className="p-4 border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Available Time Slots
          </h3>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
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
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400 text-sm">
              Please select a date first
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
