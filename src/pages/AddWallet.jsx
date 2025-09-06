import "../tailwind.css";
import { Link } from "react-router-dom";

import WalletName from "../components/WalletName";
import ShowDailyBudget from "../components/ShowDailyBudget";
import CreateButton from "../components/CreateButton";
import WalletIcon from "../components/WalletIcon";
import FinancePanel from "../components/FinancePanel";

function AddWallet() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <p className="text-2xl sm:text-[32px] ml-4 sm:ml-12 mt-4 sm:mt-6">Wallets</p>
      <div className="w-full sm:w-[1273px] h-auto sm:h-[915px] pt-6 sm:pt-[60px] mx-auto">
        <div className="flex justify-center items-center pt-6 sm:pt-[60px]">
          <div className="w-[90%] sm:w-[632px] h-auto sm:h-[424px] bg-white rounded-lg border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <div className="w-full h-[40px] bg-white rounded-lg border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)] relative">
              <Link to="/">
              <div className="w-[25px] h-[25px] bg-white border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200">
                ✖
              </div>
              </Link>
            </div>
            <div className="w-full h-auto sm:h-[344px] mt-5 sm:mt-[20px] flex flex-col items-center bg-transparent">
              <div className="w-full sm:w-[631px] h-auto sm:h-[173px] px-4 sm:px-[40px] bg-transparent flex flex-col sm:flex-row items-start gap-3 sm:gap-[12px]">
                <WalletIcon className="pr-3 sm:pr-[12px]" />
                <div className="w-full sm:w-[363px] h-[146px] bg-white flex justify-center">
                  <WalletName />
                </div>
              </div>
              <div className="w-full sm:w-[552px] h-[16px] bg-transparent mt-2 sm:mt-[10px] flex flex-row items-center justify-start">
                <p className="text-sm sm:text-[16px]">Wallet Type</p>
              </div>
              <div className="w-full sm:w-[550px] h-[40px] bg-transparent mt-2 sm:mt-[10px] gap-4 sm:gap-[17px] flex flex-row flex-wrap sm:flex-nowrap">
                <FinancePanel />
              </div>
              <div className="w-full sm:w-[552px] h-[19px] bg-transparent mt-5 sm:mt-[20px] flex flex-row">
                <ShowDailyBudget />
              </div>
              <Link to="/walletlist">
              <div className="w-full sm:w-[552px] h-[52px] bg-transparent mt-2 sm:mt-[10px] flex flex-row justify-end">
                <CreateButton />
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddWallet;
