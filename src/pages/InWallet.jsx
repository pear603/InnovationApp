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

function InWallet() {
  return (
    <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
      <div className=" ml-[76px] flex flex-col items-start space-y-2 bg-transparent">
        {/*Wallet*/}
        <h1 className="text-[32px]">Wallet Name</h1>
        {/*Current Balance*/}
        <dix className="w-[739px] h-[197px]">
            <BalanceLeft/>
        </dix>
        {/*Insert,Expense*/}
        <div className="mt-2 flex flex-row w-full max-w-[739px] h-[50px]">
            <div className=" grid grid-cols-2 w-full h-full gap-2 w-full">
                <Insert/>
                <ExpenseButton/>
            </div>
        </div>
        {/*Statistics box*/}
        <div className="flex flex-col bg-white w-[741px] h-[691px] border border-black/25 rounded-[10px]">
            <div className="mt-5 ml-10 text-[24px] font-normal">Statistics</div>
            <div className="grid grid-cols-2 w-full h-[291px] mt-4 gap-2">
                <dix className="ml-10 mr-8">
                    <PieStats/>
                </dix>
                <div className="w-[331px] h-[291px] flex flex-col gap-2">
                    <SuggestionBox/>
                    <GoodToKnow/>
                </div>
            </div>
        </div>
        
        {/* <SelectTag/> */}
        {/* <Spendings/> */}
        {/* <Notes/> */}
        
        
        {/* <BarGraph/> */}
      </div>
      <dix className="w-[523px] h-[979px] bg-white mt-14 ml-3 border border-black/25 rounded-[10px]">

      </dix>
    </div>
  );
}


export default InWallet