import "../../tailwind.css";
import { Link } from "react-router-dom";
function SelectTag() {
    return (
        <>
        <div class="relative group">
            <h1 class="flex flex-col text-[15px] font-[400]">
                Select Tag
            <button class="flex flex-row text-[14px] drop-shadow-lg justify-left bg-white-500 w-full h-8 rounded-[8px] text-black rounded border border-black/15 hover:bg-blue-400 focus:outline-none mt-[4px] pl-3 pt-[4px] text-opacity-[0]">
                Tags
                <span class="pt-1 pl-35 text-[10px]"> V</span>
            </button>
            <div class=" absolute z-50 hidden group-hover:block bg-white shadow-lg rounded-[8px] border border-black/25 mt-15 w-40">
                <a href="#" class="block px-4 py-2 pl-3 text-gray-800 rounded-[4px] hover:bg-blue-400 hover:text-white">Tag 1</a>
                <a href="#" class="block px-4 py-2 pl-3 text-gray-800 rounded-[4px] hover:bg-blue-400 hover:text-white">Tag 2</a>
                <a href="#" class="block px-4 py-2 pl-3 text-gray-800 rounded-[4px] hover:bg-blue-400 hover:text-white">Tag 3</a>
            </div>
            </h1>
        </div>
        </>
    );
}

export default SelectTag;