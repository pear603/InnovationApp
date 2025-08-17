import GoodToKnow from "../components/GoodToKnow";
import SelectTag from "../components/SelectTag";
import SuggestionBox from "../components/SuggestionBox";
import "../tailwind.css";
function InWallet() {
    return(
        <div className="">
            <SuggestionBox/>
            <GoodToKnow/>
            <SelectTag/>
        </div>
    );
}

export default InWallet