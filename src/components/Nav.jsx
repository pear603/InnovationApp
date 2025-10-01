import "../tailwind.css";
import { Link } from "react-router-dom";
import { supabase } from "../assets/supabaseClient";
import { useState } from "react";
function Nav() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    <nav className="bg-[#59A5B2] w-full px-4 sm:px-6 lg:px-20 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-white text-lg font-bold">
          <Link to="/walletlist">Monly</Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-black text-base">
          <li>
            <Link to="/walletlist" className="hover:text-gray-200 transition">
              My Wallet
            </Link>
          </li>
          <li>
            <Link to="/walletanalytic" className="hover:text-gray-200 transition">
              Wallet Analytic
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-gray-200 transition"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg mt-1 z-50">
          <ul className="flex flex-col gap-2 p-4 text-gray-800">
            <li>
              <Link
                to="/walletlist"
                className="hover:bg-gray-100 px-3 py-2 rounded transition"
                onClick={() => setIsOpen(false)}
              >
                My Wallet
              </Link>
            </li>
            <li>
              <Link
                to="/walletanalytic"
                className="hover:bg-gray-100 px-3 py-2 rounded transition"
                onClick={() => setIsOpen(false)}
              >
                Wallet Analytic
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="hover:bg-gray-100 px-3 py-2 rounded transition w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
    </>
  );
}

export default Nav;
