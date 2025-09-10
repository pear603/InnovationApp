import { useState } from "react";
import ExpenseButton from "./ExpenseButton";
import IncomeButton from "./IncomeButton";
import BothButton from "./BothButton";
import ShowDailyBudget from "./ShowDailyBudget";
import ShowDailyGoal from "./ShowDailyGoal";
import "../tailwind.css";

function FinancePanel() {
  const [openPopup, setOpenPopup] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [values, setValues] = useState({
    Expense: { budget: "" },
    Income: { goal: "" },
    Both: { budget: "", goal: "" }
  });
  const [errors, setErrors] = useState({
    Expense: { budget: "" },
    Income: { goal: "" },
    Both: { budget: "", goal: "" }
  });

  const handleClick = (type) => {
    if (openPopup && activeType === type) {
      setOpenPopup(false);
      setActiveType("");
    } else {
      setOpenPopup(true);
      setActiveType(type);
      setErrors((prev) => ({ ...prev, [type]: { ...prev[type], budget: "", goal: "" } }));
    }
  };

  const handleBudgetChange = (value) => {
    setValues((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], budget: value }
    }));

    if (!value || isNaN(value) || Number(value) <= 0) {
      setErrors((prev) => ({
        ...prev,
        [activeType]: { ...prev[activeType], budget: "Budget must be > 0 and numeric" }
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [activeType]: { ...prev[activeType], budget: "" }
      }));
    }
  };

  const handleGoalChange = (value) => {
    setValues((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], goal: value }
    }));

    if (activeType === "Income" && (!value || isNaN(value) || Number(value) <= 0)) {
      setErrors((prev) => ({
        ...prev,
        [activeType]: { ...prev[activeType], goal: "Goal must be > 0 and numeric" }
      }));
    } else if (activeType === "Both" && (value === "" || isNaN(value) || Number(value) < 0)) {
      setErrors((prev) => ({
        ...prev,
        [activeType]: { ...prev[activeType], goal: "Goal must be numeric >= 0" }
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [activeType]: { ...prev[activeType], goal: "" }
      }));
    }
  };

  return (
    <div className="relative flex flex-col items-start gap-2">
      <div className="flex gap-4 relative">
        <ExpenseButton onClick={() => handleClick("Expense")} />
        <IncomeButton onClick={() => handleClick("Income")} />
        <BothButton onClick={() => handleClick("Both")} />
      </div>

      {openPopup && (
        <div className="absolute left-0 top-full mt-2 w-[551px] bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-start justify-start p-4 z-10">

          {/* Expense */}
          {activeType === "Expense" && (
            <div className="w-full">
              <p className="text-[16px] mb-1">Budget</p>
              <input
                type="number"
                placeholder="Set Budget Amount |"
                className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                value={values.Expense.budget}
                onChange={(e) => handleBudgetChange(e.target.value)}
              />
              {errors.Expense.budget && <p className="text-red-500 text-sm mt-1">{errors.Expense.budget}</p>}

              {/* ShowDailyBudget */}
              <ShowDailyBudget budget={values.Expense.budget} />
            </div>
          )}

          {/* Income */}
          {activeType === "Income" && (
            <div className="w-full">
              <p className="text-[16px] mb-1">Goal</p>
              <input
                type="number"
                placeholder="Set Goal Amount |"
                className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                value={values.Income.goal}
                onChange={(e) => handleGoalChange(e.target.value)}
              />
              {errors.Income.goal && <p className="text-red-500 text-sm mt-1">{errors.Income.goal}</p>}

              {/* ShowDailyGoal */}
              <ShowDailyGoal goal={values.Income.goal} />
            </div>
          )}

          {/* Both */}
          {activeType === "Both" && (
            <>
              {/* Budget */}
              <div className="w-full mb-2">
                <p className="text-[16px] mb-1">Budget</p>
                <input
                  type="number"
                  placeholder="Set Budget Amount |"
                  className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                  value={values.Both.budget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                />
                {errors.Both.budget && <p className="text-red-500 text-sm mt-1">{errors.Both.budget}</p>}

                {/* ShowDailyBudget */}
                <ShowDailyBudget budget={values.Both.budget} />
              </div>

              {/* Goal */}
              <div className="w-full">
                <p className="text-[16px] mb-1">Goal</p>
                <input
                  type="number"
                  placeholder="Set Goal Amount |"
                  className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                  value={values.Both.goal}
                  onChange={(e) => handleGoalChange(e.target.value)}
                />
                {errors.Both.goal && <p className="text-red-500 text-sm mt-1">{errors.Both.goal}</p>}

              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}

export default FinancePanel;
