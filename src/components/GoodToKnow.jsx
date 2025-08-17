import "../tailwind.css";
import { Link } from "react-router-dom";
function GoodToKnow(){
    return (
    <>
    <div className="flex flex-col items-start w-322 h-137
    box-content border-1 p-4 rounded-4xl bg-gray-100">
       <h1 className="pl-15 pt-15 text-8xl">
        Good to Know
       </h1>
       <h2 className="text-[75px] pl-15 pt-13 pr-60 tracking-tighter leading-[90px] ">
        On average, you spend 126 a day, and your biggest spending day hit 158.
       </h2>
    </div>
    </>
    );
}

export default GoodToKnow;