import { CheckCircle2, Calendar, Clock, MapPin, Briefcase, User, Mail, Phone } from "lucide-react";
import { Card } from "./ui/card";

interface ConfirmationStepProps {
  branchName: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function ConfirmationStep({
  branchName,
  serviceName,
  date,
  time,
  customerName,
  customerEmail,
  customerPhone,
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Appointment Confirmed!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your appointment has been successfully scheduled
        </p>
      </div>

      <Card className="p-6 border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Appointment Details
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-medium text-gray-900 dark:text-white">{branchName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
              <p className="font-medium text-gray-900 dark:text-white">{serviceName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="font-medium text-gray-900 dark:text-white">{date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
              <p className="font-medium text-gray-900 dark:text-white">{time}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{customerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{customerEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="size-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-white">{customerPhone}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Please note:</span> A confirmation email has been sent to {customerEmail}. 
          You will receive a reminder 24 hours before your appointment.
        </p>
      </div>
    </div>
  );
}
