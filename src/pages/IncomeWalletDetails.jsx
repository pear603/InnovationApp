import GoodToKnow from "../components/Ohma/GoodToKnow";
import SelectTag from "../components/Ohma/SelectTag";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import Spendings from "../components/Ohma/Spendings";
import Notes from "../components/Ohma/Notes";
import Insert from "../components/Ohma/Insert";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import "../tailwind.css";
import BalanceLeft from "../components/BalanceLeft";
import ExpenseButton from "../components/ExpenseBtn";
import Transaction from "../components/Ohma/Transaction";
import { useNavigate } from "react-router-dom";

function BothWalletDetails() {
  const navigate = useNavigate(); 
  const handleIncomeClick = () => {
    navigate("/IncomeTx"); 
  };

  return (
    <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
      <div className=" ml-[76px] flex flex-col items-start space-y-2 bg-transparent">
        {/*Wallet*/}
        <h1 className="text-[32px]">Wallet Name</h1>
        {/*Current Balance*/}
        <div className="w-[739px] h-[197px]">
            <BalanceLeft/>
        </div>
        {/*Insert,Expense*/}
        <div className="mt-2 flex flex-row w-full max-w-[739px] h-[50px]">
            <div className=" w-full h-full gap-2 w-full">
                <Insert onClick={handleIncomeClick} />
            </div>
        </div>
        {/*Statistics box*/}
        <div className="flex flex-col bg-white w-[741px] h-[691px] border border-black/25 rounded-[10px]">
            <div className="mt-5 ml-10 text-[24px] font-normal">Statistics</div>
            <div className="grid grid-cols-2 w-full h-[291px] mt-4 gap-5">
                <div className="ml-10 mr-8 mb-5">
                    <PieStats/>
                </div>
                <div className="w-[331px] h-[291px] flex flex-col gap-5">
                    <SuggestionBox/>
                    <GoodToKnow/>
                </div>
            </div>
            <div className="w-[635px] h-[230px] ml-10 mt-9">
                <BarGraph/>
            </div>
        </div>
      </div>
      {/*Transaction box*/}
      <div className="w-[523px] h-[962px] bg-white mt-14 ml-3 border border-black/25 rounded-[10px]">
          <div className="mt-5 ml-10 mb-10 text-[29px] font-normal">Transaction</div>
          <div className="ml-10">
              <Transaction/>
              <Transaction/>
              <Transaction/>
          </div>
      </div>
    </div>
  );
}


export default BothWalletDetails