import "../tailwind.css";
import Nav from "../components/Nav";
import Home from "./Home";
import AddBtn from "../components/AddBtn";

function WalletList({ children }) {
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#E2EFF3]">
        <div className="w-screen h-screen flex flex-col">
          <p className="text-[32px]  ml-12 mt-6">Wallets</p>
          <div className="w-screen h-screen flex  justify-center items-center text-center">
            <div className="text-[#969393]">
              {/* <p>Add another wallet</p>
              <p>take full control of your money! Yeah</p> */}
              {children}
            </div>
          </div>
        </div>
        <AddBtn />
      </div>
    </>
  );
}

export default WalletList;
