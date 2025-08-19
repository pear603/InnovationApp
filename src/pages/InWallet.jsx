import GoodToKnow from "../components/GoodToKnow";
import SelectTag from "../components/SelectTag";
import SuggestionBox from "../components/SuggestionBox";
import Spendings from "../components/Spendings";
import "../tailwind.css";
function InWallet() {
    return(
        <div className="">
            <SuggestionBox/>
            <GoodToKnow/>
            <SelectTag/>
            <Spendings/>
        </div>
    );
}

export default InWallet