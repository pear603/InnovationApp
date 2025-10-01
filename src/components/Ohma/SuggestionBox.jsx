import "../../tailwind.css";
import { Link } from "react-router-dom";

function SuggestionBox() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col items-start box-content rounded-[8px] bg-gray-100 border border-black/10 w-[322px] h-[137px]">
        <h1 className="pl-[24px] pt-[8px] text-[24px] ">
          Suggestions
        </h1>
        <h2 className="text-[18px] pl-[24px] pt-[2px] pr-[60px] pb-[20px] tracking-tight leading-snug">
          Change to spending 100 baht per day, this month you will save 280 baht.
        </h2>
      </div>
    </div>
  );
}

export default SuggestionBox;
