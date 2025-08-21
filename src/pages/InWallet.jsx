import GoodToKnow from "../components/GoodToKnow";
import SelectTag from "../components/SelectTag";
import SuggestionBox from "../components/SuggestionBox";
import Spendings from "../components/Spendings";
import Notes from "../components/Notes";
import Insert from "../components/Insert";
import PieStats from "../components/PieStats";
import BarGraph from "../components/BarGraph";
import "../tailwind.css";

function InWallet() {
    return(
        <div className="">
            <SuggestionBox/>
            <GoodToKnow/>
            <SelectTag/>
            <Spendings/>
            <Notes/>
            <Insert/>
            <PieStats/>
            <BarGraph/>
        </div>
    );
}

export default InWallet