import { Clock, MapPin, User } from "lucide-react";
import { Card } from "./ui/card";

interface AppointmentCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendee: string;
  status: "upcoming" | "completed" | "cancelled";
}

export function AppointmentCard({
  title,
  date,
  time,
  location,
  attendee,
  status,
}: AppointmentCardProps) {
  const statusColors = {
    upcoming: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          {title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-green-600 dark:text-green-400" />
          <span>{date} at {time}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-green-600 dark:text-green-400" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="size-4 text-green-600 dark:text-green-400" />
          <span>{attendee}</span>
        </div>
      </div>
    </Card>
  );
}
