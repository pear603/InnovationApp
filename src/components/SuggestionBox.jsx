import "../tailwind.css";
import { Link } from "react-router-dom";
function SuggestionBox(){
    return (
    <>
    <div className="flex justify-center items-center w-322 h-137
    box-content border-1 p-4 rounded-xl bg-gray-100">
       <h1 className="absolute top-0 left-0 pl-20 pt-10 text-6xl">
        Suggestions
       </h1>
       
    </div>
    </>
    );
}

export default SuggestionBox;