import "../tailwind.css";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <>
      <nav className="bg-gray-500 p-4">
        <div className="flex item-center justify-between">
          <div className="text-white text-2xl font-bold">
            <Link to="/">Monly</Link>
          </div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/wallet">My Wallet</Link>
            </li>
            <li>
              <a href="#" className="text-white">
                Wallet Analytic
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                Profile
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Nav;
