import "../tailwind.css";

function ExpenseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-[173px] h-[40px] bg-white rounded-lg flex items-center 
                 justify-center shadow-[0_4px_6px_rgba(0,0,0,0.2)] border border-[rgba(0,0,0,0.25)] 
                 text-[16px] text-black hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
    >
      Expense
    </button>
  );
}

export default ExpenseButton;

