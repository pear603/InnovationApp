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

function InWallet() {
    return(
        <div className="w-screen h-screen flex flex-row items-start bg-[#E2EFF3]">
            <div className="w-[50vw] h-[50vh] p-2 ml-[76px] flex flex-col items-start space-x-8 space-y-8 bg-transparent">
                <h1 className="text-[100px] ">Wallet 1</h1>
                <BalanceLeft/>
                {/* <SuggestionBox/>
                <GoodToKnow/>
                <SelectTag/> */}
                {/* <Spendings/>
                <Notes/>
                <Insert/>
                <PieStats/>
                <BarGraph/> */}
            </div>
        </div>
    );
}

export default InWallet