import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col" data-testid="app-shell">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
