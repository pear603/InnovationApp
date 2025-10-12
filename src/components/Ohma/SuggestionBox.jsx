import "../../tailwind.css";
import { Link } from "react-router-dom";

function SuggestionBox({
  msg,
  variant ,
  totalSpent = 0,
  totalsave = 0,
  remainbudget = 0,
  remaingoal = 0,
  dailyLimit = 0,
  dailyGoal = 0,
  dailybudget = 0,
}) {
  let message = "Keep up the good work! Your finances are on track.";

  // --- INCOME WALLET ---
  if (variant === "income") {
    if (remaingoal > 0 && totalsave > 0) {
      message = "You're making progress! Keep saving steadily.";
    } else if (remaingoal <= 0) {
      message = "You're close to or have missed your goal. Try to save more consistently.";
    } else if (dailyGoal > 0 && totalsave / dailyGoal < 0.5) {
      message = "Your savings pace is a bit slow. Add a little more effort!";
    } else {
      message = "Steady growth! Stay disciplined with your savings.";
    }
  }

  // --- EXPENSE WALLET ---
  else if (variant === "expense") {
    if (remainbudget <= 0) {
      message = "You've reached your budget limit! Avoid extra spending.";
    } else if (dailyLimit > 0 && remainbudget / dailyLimit <= 3) {
      message = "Watch out! Budget is running low for the month.";
    } else if (totalSpent > 0 && remainbudget > 0) {
      message = "Good job tracking your spending. Keep monitoring your expenses.";
    } else {
      message = "Your spending is under control — great job!";
    }
  }

  // --- BOTH WALLET ---
  else if (variant === "both") {
    if (remaingoal <= 0 && totalsave > 0) {
      message = "You're behind your goal. Adjust spending to save more.";
    } else if (dailybudget && dailyGoal) {
      const netDaily = dailybudget - dailyGoal;
      message =
        netDaily >= 0
          ? "You can comfortably save while staying on budget."
          : "You may need to adjust your spending to meet your saving goal.";
    } else if (remainbudget < 0) {
      message = "Spending exceeded your plan. Try to cut down on unnecessary costs.";
    } else {
      message = "Balanced approach! You’re managing both saving and spending well.";
    }
  }

  if (variant === "Analytic" && msg) {
    message = msg;
  }

  
  return (
    <div className="relative w-full">
      <div className="flex flex-col items-start box-content rounded-[8px] bg-gray-100 border border-black/10 w-full h-auto">
        <h1 className="pl-[24px] pt-[8px] text-[24px] ">
          Suggestions
        </h1>
        
        <h2 className="text-[18px] pl-[24px] pt-[2px] pr-[60px] pb-[20px] tracking-tight leading-snug">
          {message}
        </h2>
      </div>
    </div>
  );
}

export default SuggestionBox;
