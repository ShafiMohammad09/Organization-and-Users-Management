import { Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      <Link to="/" className="flex items-center justify-center p-[3px]">
        <Home className="w-[18px] h-[18px] text-[#97A1B2]" strokeWidth={1.5} />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-[#97A1B2]" strokeWidth={1.25} />
          {item.path ? (
            <Link
              to={item.path}
              className="text-sm text-text-secondary leading-5"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-text-secondary leading-5">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
