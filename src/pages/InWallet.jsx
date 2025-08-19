import GoodToKnow from "../components/GoodToKnow";
import SelectTag from "../components/SelectTag";
import SuggestionBox from "../components/SuggestionBox";
import Spendings from "../components/Spendings";
import Notes from "../components/Notes";
import "../tailwind.css";
function InWallet() {
    return(
        <div className="">
            <SuggestionBox/>
            <GoodToKnow/>
            <SelectTag/>
            <Spendings/>
            <Notes/>
        </div>
    );
}

export default InWallet