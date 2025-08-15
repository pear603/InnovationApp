import "../tailwind.css";

function Panel() {
  return (
    <div className="flex justify-center items-center pt-[60px]">
      <div className=" w-[632px] h-[424px] bg-white rounded-lg border-[1px] border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)] ">
        <div className="w-[630px] h-[40px] bg-white rounded-lg border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)] relative">
          <button className="w-[25px] h-[25px] bg-white border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200">
            ✖
          </button>
        </div>
      </div>
    </div>
  );
}

export default Panel;
