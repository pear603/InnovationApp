import "../tailwind.css";

function CreateButton() {
  return (
    <div className="flex justify-center items-center h-full">
      <button className="w-[78px] h-[52px] bg-[#FBCC58] rounded-lg flex items-center 
                         justify-center shadow-[0_4px_6px_rgba(0,0,0,0.2)] ] 
                         text-[16px] text-black 
                         hover:bg-[#FFD66B] active:bg-[#E6B93B] transition-colors duration-200">
        Create
      </button>
    </div>
  );
}

export default CreateButton;
