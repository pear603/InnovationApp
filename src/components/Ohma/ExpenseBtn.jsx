import "../../tailwind.css";

function ExpenseBtn() {
  return (
    <button className="w-[78px] h-[50px] pb-1 pl-1 flex flex-col justify-center text-[16px] focus:outline-none text-black bg-[#E16451] focus:ring-0 rounded-[10px] text-sm hover:bg-[#E78374] active:bg-[#D53C25]">
      Expense
    </button>
  );
}

export default ExpenseBtn;
