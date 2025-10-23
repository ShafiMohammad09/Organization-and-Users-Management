import { ReactNode } from "react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}
