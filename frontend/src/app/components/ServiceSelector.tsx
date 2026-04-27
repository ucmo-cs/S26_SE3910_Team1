import { CreditCard, Home, TrendingUp, Users, FileText, Banknote } from "lucide-react";
import { Card } from "./ui/card";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  icon: string;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: number | null;
  onSelect: (serviceId: number) => void;
}

const iconMap: Record<string, any> = {
  CreditCard,
  Home,
  TrendingUp,
  Users,
  FileText,
  Banknote,
};

export function ServiceSelector({
  services,
  selectedService,
  onSelect,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select a Service
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          What can we help you with today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || FileText;
          return (
            <Card
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`p-8 cursor-pointer transition-all hover:shadow-lg ${
                selectedService === service.id
                  ? "border-2 border-[#37644B] dark:border-green-500 bg-[#37644B]/10 dark:bg-green-900/20"
                  : "border border-[#37644B]/30 dark:border-green-800 hover:border-[#37644B]/60 dark:hover:border-green-600"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#37644B]/15 dark:bg-green-900/30 rounded-lg shrink-0">
                  <IconComponent className="size-8 text-[#37644B] dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {service.description}
                  </p>
                  <span className="text-sm text-[#37644B] dark:text-green-400 font-medium">
                    Duration: {service.duration}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
