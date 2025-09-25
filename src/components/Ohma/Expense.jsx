import "../../tailwind.css";

function Expense({ onClick }) { 
  return (
    <div className="relative group w-full h-full">
      <button
        type="button"
        onClick={onClick} 
        className="w-full h-full flex flex-col justify-center text-[16px] focus:outline-none text-black bg-[#E16451] focus:ring-0 rounded-[10px] text-sm hover:bg-[#E78374] active:bg-[#D53C25]"
      >
        Expense
      </button>
    </div>
  );
}

export default Expense;
