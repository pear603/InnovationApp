import { useState } from "react";
import "../tailwind.css";

function ShowDailyGoal() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-center space-x-2 mt-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="w-5 h-5 border-gray-300 rounded checked:bg-green-600"
      />
      <span className="text-[16px] text-black">Show Daily Goal</span>
    </label>
  );
}

export default ShowDailyGoal;
