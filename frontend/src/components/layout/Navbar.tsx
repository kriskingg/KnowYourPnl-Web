"import { NavLink, Link } from \"react-router-dom\";
import { useState } from \"react\";
import { Menu, X, Activity } from \"lucide-react\";

const nav = [
  { to: \"/\", label: \"Home\", end: true },
  { to: \"/calculator\", label: \"MTF Calculator\" },
  { to: \"/brokers\", label: \"Brokers\" },
  { to: \"/compare\", label: \"Compare MTF\" },
  { to: \"/ledger\", label: \"MTF Ledger\" },
  { to: \"/methodology\", label: \"Resources\", match: [\"/methodology\", \"/data-sources\", \"/tariffs\", \"/guides\", \"/disclaimer\"] },
  { to: \"/about\", label: \"About\" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header
      className=\"sticky top-0 z-40 bg-[#f9f9f7]/95 backdrop-blur border-b border-black\"
      data-testid=\"site-navbar\"
    >
      <div className=\"mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between h-14\">
        <Link to=\"/\" className=\"flex items-center gap-2 group\" data-testid=\"nav-logo-link\">
          <Activity size={18} strokeWidth={1.75} className=\"text-[#d43325]\" />
          <span className=\"font-editorial text-[19px] font-semibold tracking-tight\">
            KnowYourPNL
          </span>
          <span className=\"kypnl-overline hidden sm:inline ml-2 border border-[#e5e5df] px-1.5 py-0.5\">
            MTF
          </span>
        </Link>

        <nav className=\"hidden md:flex items-center gap-1\" aria-label=\"Primary\">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, \"-\")}`}
              className={({ isActive }) => {
                const active =
                  isActive ||
                  (item.match?.some((m) => window.location.pathname.startsWith(m)) ?? false);
                return `text-[13px] px-3 py-1.5 border transition-colors duration-100 ${
                  active
                    ? \"bg-black text-[#f9f9f7] border-black\"
                    : \"text-[#0a0a0a] border-transparent hover:border-[#e5e5df] hover:bg-white\"
                }`;
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className=\"md:hidden p-2 border border-[#e5e5df]\"
          onClick={() => setOpen(true)}
          aria-label=\"Open menu\"
          data-testid=\"nav-mobile-open\"
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>
      </div>

      {open && (
        <div className=\"md:hidden fixed inset-0 z-50 bg-[#f9f9f7]\" data-testid=\"nav-mobile-drawer\">
          <div className=\"flex items-center justify-between h-14 px-4 border-b border-black\">
            <span className=\"font-editorial text-[19px] font-semibold\">KnowYourPNL</span>
            <button
              className=\"p-2 border border-[#e5e5df]\"
              onClick={() => setOpen(false)}
              aria-label=\"Close menu\"
              data-testid=\"nav-mobile-close\"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          <nav className=\"p-4 flex flex-col divide-y divide-[#e5e5df]\">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-[15px] ${isActive ? \"text-[#d43325] font-medium\" : \"text-[#0a0a0a]\"}`
                }
                data-testid={`nav-mobile-link-${item.label.toLowerCase().replace(/\s+/g, \"-\")}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
"