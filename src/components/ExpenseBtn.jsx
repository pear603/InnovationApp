import "../tailwind.css";

function ExpenseBtn() {
  return (
    <button className="w-full h-full flex flex-col justify-center text-[20px] focus:outline-none text-black bg-[#E16451] focus:ring-4 rounded-[10px] text-sm hover:bg-[#E78374] active:bg-[#D53C25]">
      Expense
    </button>
  );
}

export default ExpenseBtn;
