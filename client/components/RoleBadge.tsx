import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: "admin" | "coordinator";
}

const roleConfig = {
  admin: {
    label: "Admin",
    bgColor: "bg-success-50",
    textColor: "text-success-500",
  },
  coordinator: {
    label: "Co-ordinator",
    bgColor: "bg-warning-50",
    textColor: "text-warning-600",
  },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <div
      className={cn(
        "inline-flex px-3 py-1 justify-center items-center gap-2.5 rounded-[20px]",
        config.bgColor
      )}
    >
      <span className={cn("text-xs font-normal leading-5", config.textColor)}>
        {config.label}
      </span>
    </div>
  );
}
