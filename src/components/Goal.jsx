import "../tailwind.css";
function Goal() {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-[362px] h-[90px] bg-transparent">
          <p className="p-[10px] text-[16px] text-black">Goal</p>
          <div className="flex items-center h-[40px] 
                          w-[363px] bg-[#E7EBEE] shadow-[0_4px_6px_rgba(0,0,0,0.2)] rounded-lg">
            <input
              type="text"
              placeholder="Set Goal Amount |"
              className="ml-[15px] w-full bg-transparent outline-none text-[16px] text-[#707376]"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Goal;
