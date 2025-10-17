import "../../tailwind.css";
import { Link } from "react-router-dom";

function GoodToKnow({ totalspent, remainbudget, totalsave, remaingoal, balance, variant, sum }) {

  return (
    <div className="relative w-full h-auto">
      <div className="flex flex-col items-start box-content rounded-[8px] bg-gray-100 border border-black/10">
        <h1 className="pl-[24px] pt-[8px] text-[24px] ">Good to Know</h1>

        {variant === "Both" && (
          <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
            <p className="text-gray-700">
              This month you have spent <strong>{totalspent} ฿</strong> and saved <strong>{totalsave} ฿</strong>.
            </p>
            <p className="text-gray-700">
              Your current balance is <strong>{balance} ฿</strong>{" "}
              {balance >= 0 ? (
                "left to stick to your budget"
              ) : (
                <>You’re <strong className="text-red-500">{Math.abs(balance)} ฿</strong> over your budget</>
              )}
              , and {remaingoal >= 0
                ? <>you still need <strong>{remaingoal} ฿</strong> to reach your goal.</>
                : <>you’ve extra saved for your goal! by <strong className="text-green-500">{-remaingoal} ฿</strong>!</>}
            </p>
          </div>
        )}

        {variant === "Income" && (
          <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
            <p className="text-gray-700">
              This month you have saved <strong>{totalsave} ฿</strong>.
            </p>
            <p className="text-gray-700">
              {remaingoal >= 0
                ? <>You have <strong>{remaingoal} ฿</strong> left to reach your goal.</>
                : <>You have <strong className="text-green-500">{-remaingoal} ฿</strong> extra saved for your goal!</>}
            </p>
          </div>
        )}

        {variant === "Expense" && (
          <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
            <p className="text-gray-700">
              This month you have spent <strong>{totalspent} ฿</strong>.
            </p>
            <p className="text-gray-700">
              {remainbudget >= 0
                ? <>You have <strong>{remainbudget} ฿</strong> left to stick to your budget.</>
                : <>You are over budget by <strong className="text-red-500">{-remainbudget} ฿</strong>.</>}
            </p>
          </div>
        )}

        {variant === "Analytic" && (
          <div className="text-[18px] pl-[24px] pt-[2px] pr-[20px] pb-[20px] tracking-tight leading-snug">
            <p className="text-gray-700">
              You have spent <strong>{sum.totalSpent} ฿</strong>.
            </p>
            <p className="text-gray-700">
              You have saved <strong>{sum.totalSaved} ฿</strong> in total.
            </p>
            <p className="text-gray-700">
              Average transaction: <strong>{sum.avgTx.toFixed(1)} ฿</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default GoodToKnow;
