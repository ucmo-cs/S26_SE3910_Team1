import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddAppointmentDialogProps {
  onAdd: (appointment: {
    title: string;
    date: string;
    time: string;
    location: string;
    attendee: string;
  }) => void;
}

export function AddAppointmentDialog({ onAdd }: AddAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    attendee: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      attendee: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="size-4 mr-2" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-green-200 dark:border-green-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Add New Appointment
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Fill in the details for your new appointment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-gray-900 dark:text-white">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Meeting with..."
                required
                className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-gray-900 dark:text-white">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="text-gray-900 dark:text-white">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                  className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-gray-900 dark:text-white">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Office, Zoom, etc."
                required
                className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attendee" className="text-gray-900 dark:text-white">
                Attendee
              </Label>
              <Input
                id="attendee"
                value={formData.attendee}
                onChange={(e) =>
                  setFormData({ ...formData, attendee: e.target.value })
                }
                placeholder="Name or email"
                required
                className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Add Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
