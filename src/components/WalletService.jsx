import { useState } from "react";
import ExpenseButton from "./ExpenseButton";
import IncomeButton from "./IncomeButton";
import BothButton from "./BothButton";
import ShowDailyBudget from "./ShowDailyBudget";
import ShowDailyGoal from "./ShowDailyGoal";
import CreateButton from "./CreateButton";
import "../tailwind.css";

function WalletService({ values, onChange, onCreate }) {
  const [openPopup, setOpenPopup] = useState(false);
  const [activeType, setActiveType] = useState("");

  // Toggle popup and set active type
  const handleClick = (t) => {
    if (openPopup && activeType === t) {
      setOpenPopup(false);
      setActiveType("");
    } else {
      setOpenPopup(true);
      setActiveType(t);
    }
  };

  const checkWalletType = () => {
    switch (activeType) {
      case "Expense":
        return values.Expense;
      case "Income":
        return values.Income;
      case "Both":
        return values.Both;
      default:
        return {};
    }
  };

  // Validate finance fields
  const validateFinance = () => {
    switch (activeType) {
      case "Expense":
        if (Number(values.Expense.budget) <= 0) {
          alert("NegativeBudgetError");
          return false;
        }
        break;
      case "Income":
        if (Number(values.Income.goal) <= 0) {
          alert("NegativeGoalError");
          return false;
        }
        break;
      case "Both":
        if (Number(values.Both.budget) <= 0) {
          alert("NegativeBudgetOrGoalError");
          return false;
        }
        if (Number(values.Both.goal) < 0) {
          alert("NegativeBudgetOrGoalError");
          return false;
        }
        break;
      default:
        alert("Please select a wallet type");
        return false;
    }
    return true;
  };

  // Update the corresponding field in wallet data
  const handleValueChange = (field, val) => {
    const currentValues = checkWalletType();
    const updatedValues = { ...currentValues, [field]: val };
    onChange(activeType, updatedValues);
  };

  // Handle Create click
  const handleCreateClick = () => {
    if (!validateFinance()) return;
    onCreate();
  };

  return (
    <div className="relative flex flex-col items-start gap-2">
      {/* Type buttons */}
      <div className="flex gap-4 relative">
        <ExpenseButton onClick={() => handleClick("Expense")} />
        <IncomeButton onClick={() => handleClick("Income")} />
        <BothButton onClick={() => handleClick("Both")} />
      </div>

      {/* Popup panel */}
      {openPopup && (
        <div className="absolute left-0 top-full mt-2 w-[551px] bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-start justify-start p-4 z-10">

          {/* Expense type */}
          {activeType === "Expense" && (
            <div className="w-full">
              <p className="text-[16px] mb-1">Budget</p>
              <input
                type="number"
                placeholder="Set Budget Amount"
                className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                value={values.Expense.budget}
                onChange={(e) => handleValueChange("budget", e.target.value)}
              />
              <ShowDailyBudget
                checked={values.Expense.showDailyBudget}
                onChange={(val) => handleValueChange("showDailyBudget", val)}
              />
              <div className="w-full flex justify-end mt-2">
                <CreateButton onClick={handleCreateClick} />
              </div>
            </div>
          )}

          {/* Income type */}
          {activeType === "Income" && (
            <div className="w-full">
              <p className="text-[16px] mb-1">Goal</p>
              <input
                type="number"
                placeholder="Set Goal Amount"
                className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                value={values.Income.goal}
                onChange={(e) => handleValueChange("goal", e.target.value)}
              />
              <ShowDailyGoal
                checked={values.Income.showDailyGoal}
                onChange={(val) => handleValueChange("showDailyGoal", val)}
              />
              <div className="w-full flex justify-end mt-2">
                <CreateButton onClick={handleCreateClick} />
              </div>
            </div>
          )}

          {/* Both type */}
          {activeType === "Both" && (
            <>
              <div className="w-full mb-2">
                <p className="text-[16px] mb-1">Budget</p>
                <input
                  type="number"
                  placeholder="Set Budget Amount"
                  className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                  value={values.Both.budget}
                  onChange={(e) => handleValueChange("budget", e.target.value)}
                />
                <ShowDailyBudget
                  checked={values.Both.showDailyBudget}
                  onChange={(val) => handleValueChange("showDailyBudget", val)}
                />
              </div>

              <div className="w-full">
                <p className="text-[16px] mb-1">Goal</p>
                <input
                  type="number"
                  placeholder="Set Goal Amount"
                  className="w-full h-10 px-2 rounded bg-[#E7EBEE] outline-none text-[16px] text-[#707376]"
                  value={values.Both.goal}
                  onChange={(e) => handleValueChange("goal", e.target.value)}
                />
                <div className="w-full flex justify-end mt-2">
                  <CreateButton onClick={handleCreateClick} />
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}

export default WalletService;
