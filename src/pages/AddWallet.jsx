import "../tailwind.css";

import WalletName from "../components/WalletName";
import Goal from "../components/Goal";
import IncomeButton from "../components/IncomeButton";
import ExpenseButton from "../components/ExpenseButton";
import BothButton from "../components/BothButton";
import ShowDailyBudget from "../components/ShowDailyBudget";
import CreateButton from "../components/CreateButton";
import WalletIcon from "../components/WalletIcon";

function AddWallet() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <p className="text-[32px]  ml-12 mt-6">Wallets</p>
      <div className="w-[1273px] h-[915px] pt-[60px] mx-auto">
        <div className="flex justify-center items-center pt-[60px] ">
          <div className="w-[632px] h-[424px] bg-white rounded-lg border-[1px] border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <div className="w-[630px] h-[40px] bg-white rounded-lg border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)] relative">
              <button className="w-[25px] h-[25px] bg-white border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200">
                ✖
              </button>
            </div>
            <div className="w-[631px] h-[344px] mt-[20px] flex flex-col items-center bg-transparent">
              <div className="w-[631px] h-[173px] px-[40px] bg-transparent flex items-start  gap-[12px]">
                <WalletIcon className="pr-[12px] " />
                <div className="w-[363px] h-[146px] bg-white">
                  <WalletName />
                  <Goal />
                </div>
              </div>
              <div className="w-[552px] h-[16px] bg-transparent mt-[10px] flex flex-row justify-center ">
                <p className="Text-[16px]">Wallet Type</p>
              </div>
              <div className="w-[550px] h-[40px] bg-transparent mt-[10px]  gap-[17px] flex flex-row">
                <IncomeButton /> <ExpenseButton /> <BothButton />
              </div>
              <div className="w-[552px] h-[19px] bg-transparent mt-[20px] flex flex-row ">
                <ShowDailyBudget />
              </div>
              <div className="w-[552px] h-[52px] bg-transparent mt-[10px] flex flex-row justify-end">
                <CreateButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddWallet;
