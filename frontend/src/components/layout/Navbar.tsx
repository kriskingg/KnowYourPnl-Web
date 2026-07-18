import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Activity } from "lucide-react";

const nav = [
  { to: "/", label: "Home" }, { to: "/calculator", label: "MTF Calculator" },
  { to: "/brokers", label: "Brokers" }, { to: "/compare", label: "Compare MTF" },
  { to: "/ledger", label: "MTF Ledger" }, { to: "/blog", label: "Blog" },
  { to: "/methodology", label: "Resources" }, { to: "/about", label: "About" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#102A43] bg-[#F7F5EF]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="KnowYourPNL home">
          <Activity size={18} className="text-[#087F6D]" />
          <span className="font-editorial text-xl font-semibold">KnowYourPNL</span>
          <span className="kypnl-overline hidden border border-[#d8d5cc] px-1.5 py-0.5 sm:inline">MTF</span>
        </Link>
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary navigation">
          {nav.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `px-2.5 py-1.5 text-[13px] ${isActive ? "bg-[#102A43] text-white" : "hover:bg-[#102A43]/5"}`}>{item.label}</NavLink>)}
        </nav>
        <button className="border border-[#102A43] p-2 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      {open && <nav className="border-t border-[#102A43] bg-[#F7F5EF] px-4 py-2 md:hidden" aria-label="Mobile navigation">{nav.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="block border-b border-[#d8d5cc] py-3 text-sm">{item.label}</NavLink>)}</nav>}
    </header>
  );
};
