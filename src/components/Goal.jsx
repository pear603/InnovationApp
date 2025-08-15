import "../tailwind.css";
function Goal() {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-[362px] h-[67px] bg-[#FFFFFF] ">
            <p class="p-[10px] text-[16px] text-black">Goal</p>
            <div className="flex items-center justify-left h-full 
                            w-[362px] h-[40px] bg-[#E7EBEE] shadow-[0_4px_6px_rgba(0,0,0,0.2)] rounded-lg">
                <p class="m-[20px] text-[16px] text-[#707376]">Set Goal Amount |</p>
            </div>
            
        </div>
      </div>
    </>
  );
}

export default Goal;
