import "../../tailwind.css";

function Insert({ onClick }) {
  return (
    <div className="relative group w-full h-full">
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full flex flex-col justify-center text-[24px] font-semibold focus:outline-none text-white bg-[#9AD24B] focus:ring-0 rounded-[5px] hover:bg-[#ACDA6C] active:bg-[#9AD24B]"
      >
        Insert
      </button>
    </div>
  );
}

export default Insert;
