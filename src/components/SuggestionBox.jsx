import "../tailwind.css";
import { Link } from "react-router-dom";
function SuggestionBox(){
    return (
    <>
    <div className="flex justify-center items-center w-322 h-137
    box-content border-1 p-4 rounded-4xl bg-gray-100">
       <h1 className="absolute top-0 left-0 pl-20 pt-15 text-8xl">
        Suggestions
       </h1>
       <h2 className="text-[75px] pl-15 pt-30 pr-60 tracking-tighter leading-snug ">
        Change to spending 100 baht per day, this month you will save 280 baht.
       </h2>
    </div>
    </>
    );
}

export default SuggestionBox;