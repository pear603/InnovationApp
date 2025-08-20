import { useState } from "react";

function ShowDailyBudget() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="w-5 h-5 border-gray-300 rounded checked:bg-green-600"
      />
      <span className="text-[16px] text-black">Show Daily Budget</span>
    </label>
  );
}

export default ShowDailyBudget;
