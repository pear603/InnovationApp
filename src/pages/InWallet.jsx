import GoodToKnow from "../components/Ohma/GoodToKnow";
import SelectTag from "../components/Ohma/SelectTag";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import Spendings from "../components/Ohma/Spendings";
import Notes from "../components/Ohma/Notes";
import Insert from "../components/Ohma/Insert";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
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