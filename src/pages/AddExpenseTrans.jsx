import "../tailwind.css";
import BalanceAll from "../components/BalanceAll";
import SelectTag from "../components/Ohma/SelectTag";
import Income from "../components/Ohma/Income";
import Notes from "../components/Ohma/Notes";
import InsertBtn from "../components/Ohma/InsertBtn";

function AddExpenseTrans() {
    return (
        <>
        <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
            <div className="mt-30 w-[632px] h-[310px] bg-white border border-black/25 rounded-[10px] drop-shadow-lg">
                <div className="flex justify-end border-b border-black/25 px-4 py-2 drop-shadow-lg ">
                    <button className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <div className="ml-8 mt-3 text-[20px] font-[400]">
                    Wallet Name
                </div>
                <div className="flex flex-col ml-8 mt-1 text-[15px]">
                    <div className="grid grid-cols-6 gap-1">
                        <div className="col-span-2">
                            <SelectTag/>
                        </div>

                        <div className="col-span-4 w-90">
                            <Income/>
                        </div>
                    </div>
                    <div className="w-140">
                        <Notes/>
                    </div>
                    <div className="mt-6 ml-118">
                        <InsertBtn/>  
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AddExpenseTrans