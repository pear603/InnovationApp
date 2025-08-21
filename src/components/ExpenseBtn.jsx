import "../tailwind.css";

function ExpenseBtn() {
  return (
    <button className="w-[361px] h-[50px] bg-[#E16451] flex justify-center items-center rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.2)] ] text-[20px]  hover:bg-[#E78374] active:bg-[#D53C25] transition-colors duration-200">
      Expense
    </button>
  );
}

export default ExpenseBtn;
