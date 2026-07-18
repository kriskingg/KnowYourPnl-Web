import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-[#102A43] mt-24 bg-[#F7F5EF]" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
        <div>
          <div className="kypnl-overline mb-3">Product</div>
          <ul className="space-y-1.5">
            <li><Link className="hover:underline" to="/calculator">MTF Calculator</Link></li>
            <li><Link className="hover:underline" to="/brokers">Brokers</Link></li>
            <li><Link className="hover:underline" to="/compare">Compare MTF</Link></li>
            <li><Link className="hover:underline" to="/ledger">MTF Ledger</Link></li>
          </ul>
        </div>
        <div>
          <div className="kypnl-overline mb-3">Resources</div>
          <ul className="space-y-1.5">
            <li><Link className="hover:underline" to="/methodology">Methodology</Link></li>
            <li><Link className="hover:underline" to="/tariffs/current">Current Tariffs</Link></li>
            <li><Link className="hover:underline" to="/tariffs/history">Tariff History</Link></li>
            <li><Link className="hover:underline" to="/data-sources">Data Sources</Link></li>
            <li><Link className="hover:underline" to="/guides">Guides</Link></li>
            <li><Link className="hover:underline" to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <div className="kypnl-overline mb-3">Company</div>
          <ul className="space-y-1.5">
            <li><Link className="hover:underline" to="/about">About</Link></li>
            <li><Link className="hover:underline" to="/disclaimer">Disclaimer</Link></li>
            <li><Link className="hover:underline" to="/privacy">Privacy</Link></li>
            <li><Link className="hover:underline" to="/cookies">Cookies</Link></li>
            <li><Link className="hover:underline" to="/advertising-disclosure">Advertising disclosure</Link></li>
            <li><Link className="hover:underline" to="/terms">Terms</Link></li>
            <li><Link className="hover:underline" to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="kypnl-overline mb-3">Status</div>
          <p className="text-[#486581] leading-relaxed">
            Independent MTF cost intelligence. Not affiliated with any broker. All tariffs shown are
            demonstration data pending account-statement verification.
          </p>
        </div>
      </div>
      <div className="border-t border-[#e5e5df]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between text-[11px] text-[#486581]">
          <span>© {new Date().getFullYear()} KnowYourPNL</span>
          <span className="font-mono-ibm">mtf-methodology-v1</span>
        </div>
      </div>
    </footer>
  );
};
