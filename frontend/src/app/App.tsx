import { useState, useEffect } from "react";
import { Calendar, Moon, Sun } from "lucide-react";
import { AppointmentCard } from "./components/AppointmentCard";
import { AddAppointmentDialog } from "./components/AddAppointmentDialog";
import { Button } from "./components/ui/button";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendee: string;
  status: "upcoming" | "completed" | "cancelled";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Team Standup Meeting",
    date: "Feb 14, 2026",
    time: "10:00 AM",
    location: "Conference Room A",
    attendee: "Development Team",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Client Presentation",
    date: "Feb 14, 2026",
    time: "2:00 PM",
    location: "Zoom Meeting",
    attendee: "Sarah Johnson",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Doctor Appointment",
    date: "Feb 15, 2026",
    time: "9:30 AM",
    location: "Medical Center",
    attendee: "Dr. Smith",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Project Review",
    date: "Feb 12, 2026",
    time: "3:00 PM",
    location: "Office",
    attendee: "Project Manager",
    status: "completed",
  },
  {
    id: "5",
    title: "Lunch Meeting",
    date: "Feb 13, 2026",
    time: "12:30 PM",
    location: "Downtown Cafe",
    attendee: "Mike Chen",
    status: "cancelled",
  },
];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleAddAppointment = (appointmentData: {
    title: string;
    date: string;
    time: string;
    location: string;
    attendee: string;
  }) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...appointmentData,
      status: "upcoming",
    };
    setAppointments([newAppointment, ...appointments]);
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-green-200 dark:border-green-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Calendar className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Appointments
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your schedule
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <AddAppointmentDialog onAdd={handleAddAppointment} />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
              >
                {theme === "light" ? (
                  <Moon className="size-5 text-green-600" />
                ) : (
                  <Sun className="size-5 text-green-400" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {upcomingAppointments.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Upcoming
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {appointments.filter((apt) => apt.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completed
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
              {appointments.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Appointments
          </h2>
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} {...appointment} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-green-200 dark:border-green-800 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No upcoming appointments
              </p>
            </div>
          )}
        </section>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Past Appointments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} {...appointment} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
