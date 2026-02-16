import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

export function CustomerInfoForm({
  customerInfo,
  onChange,
}: CustomerInfoFormProps) {
  const handleChange = (field: keyof CustomerInfo, value: string) => {
    onChange({ ...customerInfo, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your Information
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please provide your contact details
        </p>
      </div>

      <Card className="p-6 border-green-200 dark:border-green-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={customerInfo.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="John"
              required
              className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={customerInfo.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Doe"
              required
              className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 dark:text-white">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john.doe@example.com"
              required
              className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900 dark:text-white">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              required
              className="border-green-200 dark:border-green-800 focus:border-green-600 dark:focus:border-green-400"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes" className="text-gray-900 dark:text-white">
              Additional Notes (Optional)
            </Label>
            <textarea
              id="notes"
              value={customerInfo.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any specific requests or information we should know..."
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-green-600 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600/20 dark:focus:ring-green-400/20"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
