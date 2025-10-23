import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "blocked" | "inactive";
  showDot?: boolean;
}

const statusConfig = {
  active: {
    label: "Active",
    bgColor: "bg-success-50",
    textColor: "text-success-500",
    dotColor: "fill-success-500",
  },
  blocked: {
    label: "Blocked",
    bgColor: "bg-error-50",
    textColor: "text-error-500",
    dotColor: "fill-error-500",
  },
  inactive: {
    label: "Inactive",
    bgColor: "bg-gray-50",
    textColor: "text-text-secondary",
    dotColor: "fill-[#97A1B2]",
  },
};

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex px-2 py-1 justify-center items-center gap-2.5 rounded-[20px]",
        config.bgColor
      )}
    >
      <div className="flex justify-center items-center gap-1">
        {showDot && (
          <svg
            className="w-2 h-2"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="3.2" className={config.dotColor} />
          </svg>
        )}
        <span className={cn("text-xs font-normal leading-5", config.textColor)}>
          {config.label}
        </span>
      </div>
    </div>
  );
}
