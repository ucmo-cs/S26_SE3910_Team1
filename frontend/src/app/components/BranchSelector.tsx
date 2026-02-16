import { MapPin, Phone, Clock } from "lucide-react";
import { Card } from "./ui/card";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: string | null;
  onSelect: (branchId: string) => void;
}

export function BranchSelector({
  branches,
  selectedBranch,
  onSelect,
}: BranchSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Select a Branch
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose the branch location that's most convenient for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            onClick={() => onSelect(branch.id)}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedBranch === branch.id
                ? "border-2 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600"
            }`}
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
              {branch.name}
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="size-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <span>{branch.address}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="size-4 text-green-600 dark:text-green-400 shrink-0" />
                <span>{branch.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="size-4 text-green-600 dark:text-green-400 shrink-0" />
                <span>{branch.hours}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
