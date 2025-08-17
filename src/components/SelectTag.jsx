import "../tailwind.css";
import { Link } from "react-router-dom";
function SelectTag() {
    return (
        <>
        <div class="relative group">
        <h1 class="flex flex-col text-[45px]">
            Select Tags
        <button class="flex flex-row text-[45px] justify-left bg-white-500 w-173 h-30 border-1 rounded-[25px] text-black rounded hover:bg-blue-400 focus:outline-none pl-10 pt-5 text-opacity-[0]">
            Dropdown
            <span class="pl-95 pt-3 text-[30px] font-bold"> V</span>
        </button>
        <div class=" hidden group-hover:block bg-white shadow-lg rounded mt-1 w-173">
            <a href="#" class="block px-4 py-2 pl-20 text-gray-800 hover:bg-blue-400 hover:text-white">Tag 1</a>
            <a href="#" class="block px-4 py-2 pl-20 text-gray-800 hover:bg-blue-400 hover:text-white">Tag 2</a>
            <a href="#" class="block px-4 py-2 pl-20 text-gray-800 hover:bg-blue-400 hover:text-white">Tag 3</a>
        </div>
        </h1>
        </div>
        </>
    );
}

export default SelectTag;