import "../../tailwind.css";
import { Link } from "react-router-dom";
function GoodToKnow(){
    return (
    <>
    <div className="flex flex-col items-start w-full h-full
    box-content p-4 rounded-[10px] bg-gray-100 border-black">
       <h1 className="text-[20px]">
        Good to Know
       </h1>
       <h2 className="text-[20px] tracking-tighter leading-snug ">
        On average, you spend 126 a day, and your biggest spending day hit 158.
       </h2>
    </div>
    </>
    );
}

export default GoodToKnow;