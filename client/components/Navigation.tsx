import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Manage B2B organizations", path: "/" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex px-4 sm:px-6 md:px-[70px] py-4 items-start gap-8 w-full bg-white shadow-[0_2px_12px_0_rgba(54,89,226,0.12)]">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <div key={item.path} className="flex flex-col items-start gap-4 relative">
            <Link
              to={item.path}
              className={cn(
                "text-center text-sm leading-5",
                isActive
                  ? "text-primary font-bold"
                  : "text-text-secondary font-normal"
              )}
            >
              {item.label}
            </Link>
            {isActive && index === navItems.length - 1 && (
              <div className="absolute -bottom-4 left-0 w-[179px] h-0.5 bg-primary rounded-full" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
