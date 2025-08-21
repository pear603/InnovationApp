import "../tailwind.css";
import { Link } from "react-router-dom";

function AddBtn() {
  return (
    <>
      <div className="group fixed bottom-4 right-4 p-2 cursor-pointer flex items-center justify-center h-[70px] w-[70px] bg-[#D9D9D9] rounded-full">
        <div className="text-[48px] text-center pb-2 text-gray-500">+</div>
        <Link to="/wallet">
          <div className="absolute transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-27 group-hover:-translate-x-0 bg-[#D9D9D9] rounded-full bottom-4 right-4 cursor-pointer flex items-center justify-center h-[50px] w-[50px] ">
            <div className="text-black text-[12px] text-center">Wallet</div>
          </div>
        </Link>
        <Link to="/addTag">
          <div className="absolute transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-14 group-hover:-translate-x-0 h-[50px] w-[50px] bg-[#D9D9D9] rounded-full bottom-4 right-4 cursor-pointer flex items-center justify-center">
            <div className="text-[12px] text-center text-black">Tag</div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default AddBtn;
