import "../../tailwind.css";
import { Link } from "react-router-dom";
function GoalAchieved(){
    return (
    <>
    <div className="relative w-full">
      <div className="flex flex-col items-start box-content rounded-[8px] bg-gray-100 border border-black/10">
        <h1 className="pl-[24px] pt-[8px] text-[24px] ">
          Goal Achieved
        </h1>
        <h2 className="text-[18px] pl-[24px] pt-[2px] pr-[60px] pb-[20px] tracking-tight leading-snug">
          You have successfully completed 3 goals !
        </h2>
      </div>
    </div>
    </>
    );
}

export default GoalAchieved;