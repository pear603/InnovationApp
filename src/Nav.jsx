import "./tailwind.css";
function Nav() {
  return (
    <>
      <nav className="bg-gray-500 p-4">
        <div className="flex item-center justify-between h-65px">
          <div className="text-white text-2xl font-bold">Monly</div>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-white">My Wallet</a></li>
            <li><a href="#" className="text-white">Wallet Analytic</a></li>
            <li><a href="#" className="text-white">Profile</a></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Nav;
