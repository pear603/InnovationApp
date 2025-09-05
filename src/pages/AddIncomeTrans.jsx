import "../tailwind.css";
import BalanceAll from "../components/BalanceAll";

function AddIncomeTrans() {
    return (
        <>
        <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
            <div className="mt-30 w-[632px] h-[332px] bg-white border border-black/25 rounded-[10px] drop-shadow-lg">
                <div class="flex justify-end border-b border-black/25 px-4 py-2 drop-shadow-lg ">
                    <button class="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default AddIncomeTrans