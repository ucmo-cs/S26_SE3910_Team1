import { useState, useEffect } from "react";
import { Building2, Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { StepIndicator } from "./components/StepIndicator";
import { BranchSelector } from "./components/BranchSelector";
import { ServiceSelector } from "./components/ServiceSelector";
import { DateTimeSelector } from "./components/DateTimeSelector";
import { CustomerInfoForm } from "./components/CustomerInfoForm";
import { ConfirmationStep } from "./components/ConfirmationStep";

const branches = [
  {
    id: "downtown",
    name: "Downtown Branch",
    address: "123 Main Street, Suite 100, City, ST 12345",
    phone: "(555) 123-4567",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
  },
  {
    id: "westside",
    name: "Westside Branch",
    address: "456 Oak Avenue, City, ST 12346",
    phone: "(555) 234-5678",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
  },
  {
    id: "northgate",
    name: "Northgate Branch",
    address: "789 Pine Road, City, ST 12347",
    phone: "(555) 345-6789",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
  },
  {
    id: "southpark",
    name: "Southpark Branch",
    address: "321 Elm Boulevard, City, ST 12348",
    phone: "(555) 456-7890",
    hours: "Mon-Fri: 9:00 AM - 5:00 PM",
  },
];

const services = [
  {
    id: "account",
    name: "Open Account",
    description: "Open a new checking or savings account",
    duration: "30 min",
    icon: "CreditCard",
  },
  {
    id: "loan",
    name: "Loan Consultation",
    description: "Personal, auto, or home loan discussions",
    duration: "45 min",
    icon: "Home",
  },
  {
    id: "investment",
    name: "Investment Advice",
    description: "Meet with a financial advisor",
    duration: "60 min",
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business Banking",
    description: "Business accounts and services",
    duration: "45 min",
    icon: "Users",
  },
  {
    id: "mortgage",
    name: "Mortgage Services",
    description: "Mortgage applications and refinancing",
    duration: "60 min",
    icon: "FileText",
  },
  {
    id: "general",
    name: "General Inquiry",
    description: "General banking questions and support",
    duration: "15 min",
    icon: "Banknote",
  },
];

const availableTimeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

const steps = ["Branch", "Service", "Date & Time", "Your Info", "Confirm"];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBranch !== null;
      case 2:
        return selectedService !== null;
      case 3:
        return selectedDate !== null && selectedTime !== null;
      case 4:
        return (
          customerInfo.firstName &&
          customerInfo.lastName &&
          customerInfo.email &&
          customerInfo.phone
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNewAppointment = () => {
    setCurrentStep(1);
    setSelectedBranch(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    });
  };

  const getBranchName = () => {
    return branches.find((b) => b.id === selectedBranch)?.name || "";
  };

  const getServiceName = () => {
    return services.find((s) => s.id === selectedService)?.name || "";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-green-200 dark:border-green-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Building2 className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bank Appointments
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule your visit with us
                </p>
              </div>
            </div>

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
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep < 5 && <StepIndicator steps={steps} currentStep={currentStep} />}

        <div className="mt-8 mb-8">
          {currentStep === 1 && (
            <BranchSelector
              branches={branches}
              selectedBranch={selectedBranch}
              onSelect={setSelectedBranch}
            />
          )}

          {currentStep === 2 && (
            <ServiceSelector
              services={services}
              selectedService={selectedService}
              onSelect={setSelectedService}
            />
          )}

          {currentStep === 3 && (
            <DateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              availableSlots={availableTimeSlots}
            />
          )}

          {currentStep === 4 && (
            <CustomerInfoForm
              customerInfo={customerInfo}
              onChange={setCustomerInfo}
            />
          )}

          {currentStep === 5 && (
            <ConfirmationStep
              branchName={getBranchName()}
              serviceName={getServiceName()}
              date={selectedDate ? formatDate(selectedDate) : ""}
              time={selectedTime || ""}
              customerName={`${customerInfo.firstName} ${customerInfo.lastName}`}
              customerEmail={customerInfo.email}
              customerPhone={customerInfo.phone}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-green-200 dark:border-green-800">
          {currentStep === 5 ? (
            <div className="w-full flex justify-center">
              <Button
                onClick={handleNewAppointment}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Book Another Appointment
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-green-200 dark:border-green-800"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700"
              >
                {currentStep === 4 ? "Confirm Appointment" : "Next"}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
