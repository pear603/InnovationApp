import "../../tailwind.css";
import { Link } from "react-router-dom";
function SuggestionBox(){
    return (
    <>
    <div className="flex flex-col items-start w-322 h-137
    box-content p-4 rounded-4xl bg-gray-100">
       <h1 className="pl-15 pt-15 text-8xl">
        Suggestions
       </h1>
       <h2 className="text-[75px] pl-15 pt-13 pr-60 tracking-tighter leading-[90px] ">
        Change to spending 100 baht per day, this month you will save 280 baht.
       </h2>
    </div>
    </>
    );
}

export default SuggestionBox;