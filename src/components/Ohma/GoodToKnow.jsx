import "../../tailwind.css";
import { Link } from "react-router-dom";
function GoodToKnow(){
    return (
    <>
    <div className="relative w-[322px] h-[137px]">
      <div className="flex flex-col items-start box-content rounded-[8px] bg-gray-100 border border-black/10">
        <h1 className="pl-[24px] pt-[8px] text-[24px] ">
          Good to Know
        </h1>
        <h2 className="text-[18px] pl-[24px] pt-[2px] pr-[60px] pb-[20px] tracking-tight leading-snug">
          On average, you spend 126 a day, and your biggest spending day hit 158.
        </h2>
      </div>
    </div>
    </>
    );
}

export default GoodToKnow;