import Nav from "../components/Nav";
import AddWallet from "../components/addWallet";
import "../tailwind.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="inline justify-center items-center text-center">
          <p>Add another wallet</p>
          <p>take full control of your money! Yeah</p>
        </div>
      </div>
      {/* <button
        className="h-[70px] w-[70px] bg-gray-400 rounded-full text-[48px] text-center bottom-4 right-4 fixed cursor-pointer"
        onClick={() => navigate("/wallet")}
      >
        +
      </button> */}
      <Link to="/wallet">
        <div className="h-[70px] w-[70px] bg-gray-400 rounded-full text-[48px] text-center fixed bottom-4 right-4 cursor-pointer flex items-center justify-center">
          +
        </div>
      </Link>
    </>
  );
}

export default Home;
