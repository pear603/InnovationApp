import "../tailwind.css";

function BothButton() {
  return (
    <div className="flex justify-center items-center h-full">
      <button className="w-[173px] h-[40px] bg-white rounded-lg flex items-center 
                         justify-center shadow-[0_4px_6px_rgba(0,0,0,0.2)] border-[1px] border-[rgba(0,0,0,0.25)] 
                         text-[16px] text-black 
                         hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200">
        Both
      </button>
    </div>
  );
}

export default BothButton;
