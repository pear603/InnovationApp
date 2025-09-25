import "../../tailwind.css";

function Insert({ onClick }) { 
  return (
    <div className="relative group w-full h-full">
      <button
        type="button"
        onClick={onClick} 
        className="w-full h-full flex flex-col justify-center text-[20px] focus:outline-none text-black bg-[#9AD24B] focus:ring-1 rounded-[10px] text-sm hover:bg-[#ACDA6C] active:bg-[#9AD24B]"
      >
        Insert
      </button>
    </div>
  );
}

export default Insert;
