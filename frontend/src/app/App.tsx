import { useCallback, useEffect, useState } from "react";
import { Building2, Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { StepIndicator } from "./components/StepIndicator";
import { BranchSelector } from "./components/BranchSelector";
import { ServiceSelector } from "./components/ServiceSelector";
import { DateTimeSelector } from "./components/DateTimeSelector";
import { CustomerInfoForm } from "./components/CustomerInfoForm";
import { ConfirmationStep } from "./components/ConfirmationStep";
import {
  bookAppointment,
  cancelAppointment,
  fetchBranches,
  fetchServices,
  formatLocalDateIso,
  type BookAppointmentResponse,
  type BranchDto,
  type ServiceDto,
} from "@/api/bankingApi";

const steps = ["Service", "Branch", "Date & Time", "Your Info", "Confirm"];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentStep, setCurrentStep] = useState(1);

  const [services, setServices] = useState<ServiceDto[]>([]);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [lastBooking, setLastBooking] = useState<BookAppointmentResponse | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    setLoadingServices(true);
    setCatalogError(null);
    fetchServices()
      .then((data) => {
        if (!cancelled) setServices(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setCatalogError(e instanceof Error ? e.message : "Could not load services.");
          setServices([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingServices(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedService == null) {
      setBranches([]);
      setBranchesError(null);
      return;
    }
    let cancelled = false;
    setLoadingBranches(true);
    setBranchesError(null);
    fetchBranches(selectedService)
      .then((data) => {
        if (!cancelled) setBranches(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setBranchesError(e instanceof Error ? e.message : "Could not load branches.");
          setBranches([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBranches(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedService]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSelectService = (id: number) => {
    setSelectedService(id);
    setSelectedBranch(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSelectBranch = (id: number) => {
    setSelectedBranch(id);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const handleTimeSelect = useCallback((time: string | null) => {
    setSelectedTime(time);
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedBranch !== null;
      case 3:
        return selectedDate !== null && selectedTime !== null;
      case 4:
        return (
          !!customerInfo.firstName &&
          !!customerInfo.lastName &&
          !!customerInfo.email &&
          !!customerInfo.phone
        );
      default:
        return false;
    }
  };

  const submitBooking = async () => {
    if (
      selectedBranch == null ||
      selectedService == null ||
      selectedDate == null ||
      selectedTime == null
    ) {
      return;
    }
    setBookingError(null);
    setBookingSubmitting(true);
    try {
      const res = await bookAppointment({
        branchId: selectedBranch,
        serviceId: selectedService,
        date: formatLocalDateIso(selectedDate),
        timeSlot: selectedTime,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        notes: customerInfo.notes,
      });
      setLastBooking(res);
      setIsCancelled(false);
      setCancelError(null);
      setCurrentStep(5);
    } catch (e: unknown) {
      setBookingError(e instanceof Error ? e.message : "Booking failed.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 4 && canProceed()) {
      await submitBooking();
      return;
    }
    if (canProceed() && currentStep < 5) {
      setBookingError(null);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setBookingError(null);
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
    setLastBooking(null);
    setBookingError(null);
    setIsCancelled(false);
    setCancelError(null);
  };

  const handleCancelAppointment = async () => {
    if (lastBooking == null) return;
    setCancelError(null);
    setCancelling(true);
    try {
      await cancelAppointment(lastBooking.id);
      setIsCancelled(true);
    } catch (e: unknown) {
      setCancelError(e instanceof Error ? e.message : "Could not cancel appointment.");
    } finally {
      setCancelling(false);
    }
  };

  const displayBranchName =
    lastBooking?.branchName ??
    branches.find((b) => b.id === selectedBranch)?.name ??
    "";
  const displayServiceName =
    lastBooking?.serviceName ??
    services.find((s) => s.id === selectedService)?.name ??
    "";
  const displayDate = lastBooking?.date ?? "";
  const displayTime = lastBooking?.time ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep < 5 && <StepIndicator steps={steps} currentStep={currentStep} />}

        {catalogError && currentStep === 1 && (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {catalogError} Make sure the Spring Boot API is running on port 8080 (use{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">npm run dev</code> so{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">/api</code> proxies to the
            backend).
          </div>
        )}

        <div className="mt-8 mb-8">
          {currentStep === 1 && (
            <>
              {loadingServices ? (
                <p className="text-gray-600 dark:text-gray-400">Loading services…</p>
              ) : (
                <ServiceSelector
                  services={services}
                  selectedService={selectedService}
                  onSelect={handleSelectService}
                />
              )}
            </>
          )}

          {currentStep === 2 && (
            <>
              {selectedService == null ? (
                <p className="text-gray-600 dark:text-gray-400">Please select a service first.</p>
              ) : loadingBranches ? (
                <p className="text-gray-600 dark:text-gray-400">Loading branches…</p>
              ) : branchesError ? (
                <p className="text-red-600 dark:text-red-400" role="alert">
                  {branchesError}
                </p>
              ) : (
                <BranchSelector
                  branches={branches}
                  selectedBranch={selectedBranch}
                  onSelect={handleSelectBranch}
                />
              )}
            </>
          )}

          {currentStep === 3 && (
            <DateTimeSelector
              branchId={selectedBranch}
              serviceId={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
            />
          )}

          {currentStep === 4 && (
            <>
              <CustomerInfoForm customerInfo={customerInfo} onChange={setCustomerInfo} />
              {bookingError && (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
                  {bookingError}
                </p>
              )}
            </>
          )}

          {currentStep === 5 && lastBooking && (
            <ConfirmationStep
              branchName={displayBranchName}
              serviceName={displayServiceName}
              date={displayDate}
              time={displayTime}
              customerName={`${customerInfo.firstName} ${customerInfo.lastName}`}
              customerEmail={customerInfo.email}
              customerPhone={customerInfo.phone}
              appointmentId={lastBooking.id}
              isCancelled={isCancelled}
              cancelling={cancelling}
              cancelError={cancelError}
              onCancelAppointment={handleCancelAppointment}
            />
          )}
        </div>

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
                onClick={() => void handleNext()}
                disabled={!canProceed() || bookingSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700"
              >
                {bookingSubmitting
                  ? "Submitting…"
                  : currentStep === 4
                    ? "Confirm Appointment"
                    : "Next"}
                {!bookingSubmitting && <ArrowRight className="size-4 ml-2" />}
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
