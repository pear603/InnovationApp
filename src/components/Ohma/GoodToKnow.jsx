import "../../tailwind.css";
import { Link } from "react-router-dom";
function GoodToKnow({totalspent, remainbudget, totalsave, remaingoal , variant}) {
    return (
    <>
    <div className="relative w-full h-auto">
      <div className="flex flex-col items-start box-content rounded-[8px] bg-gray-100 border border-black/10">
        <h1 className="pl-[24px] pt-[8px] text-[24px] ">
          Good to Know
        </h1>
        {variant === "Both"&&(
        <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
          <p className="text-gray-700">
        This month you have spent <strong>{totalspent} ฿</strong> and saved <strong>{totalsave} ฿</strong>.
      </p>
      <p className="text-gray-700">
        You have <strong>{remainbudget} ฿</strong> left to stick to your budget and <strong>{remaingoal} ฿</strong> left to reach your goal.
      </p>
        </div>)}

        {variant === "Income"&&(
        <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
          <p className="text-gray-700">
        This month you have saved <strong>{totalsave} ฿</strong>.
      </p>
      <p className="text-gray-700">
        You have <strong>{remaingoal} ฿</strong> left to reach your goal.
      </p>
        </div>)}

        {variant === "Expense"&&(
        <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
          <p className="text-gray-700">
        This month you have spent <strong>{totalspent} ฿</strong>.
      </p>
      <p className="text-gray-700">
        You have <strong>{remainbudget} ฿</strong> left to stick to your budget
      </p>
        </div>)}

      </div>
    </div>
    </>
    );
}

export default GoodToKnow;