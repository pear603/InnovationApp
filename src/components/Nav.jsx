import "../tailwind.css";
import { Link } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';
function Nav() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <>
      <nav className="bg-[#59A5B2] h-[48px] py-[10px] px-[76px]">
        <div className="flex item-center justify-between ">
          <div className="text-white text-base font-bold ">
            <Link to="/">Monly</Link>
          </div>
          <ul className="flex gap-16 pr-[78px] text-base">
            <li>
              <Link to="/walletlist">My Wallet</Link>
            </li>
            <li>
              <Link to="/walletanalytic">Wallet Analytic</Link>
            </li>
            <li>
              <a href="#" className="text-white  ">
                Profile
              </a>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Nav;
