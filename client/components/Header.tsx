import { Bell, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex w-full h-[72px] px-8 justify-between items-center bg-white/70 shadow-[0_4px_8px_0_rgba(54,89,226,0.08)] backdrop-blur-[8px]">
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Home" className="inline-flex items-center">
          <img
            src="https://media.licdn.com/dms/image/sync/v2/D5627AQEExz9IHVAMhQ/articleshare-shrink_800/B56Zk9_A22H8AI-/0/1757681553241?e=2147483647&v=beta&t=EGoaQOgT6pB0JcjJXFx9Si9eDM5DcyQ-T5o27C5CzCw"
            alt="Logo"
            className="h-[45px] w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4">
          <Link to="/support" aria-label="Support" className="text-[#0B1331] hover:text-primary transition-colors">
            <Headphones className="w-5 h-5" />
          </Link>
          <Link to="/notifications" aria-label="Notifications" className="text-[#0B1331] hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
        </div>

        <Link to="/profile" aria-label="Profile">
          <div className="flex w-10 h-10 p-2 justify-center items-center rounded-full bg-brand-50">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                fill="#E7DFFF"
                stroke="#6834FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                stroke="#6834FF"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </Link>
      </div>
    </header>
  );
}
