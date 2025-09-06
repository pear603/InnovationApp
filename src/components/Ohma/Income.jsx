import "../../tailwind.css";
import { Link } from "react-router-dom";
function Income() {
    return (
        <>
        <div class="relative group">
        <div>
            <label for="first_name" class="block text-[16px] text-gray-900 text-black">Income</label>
            <input type="text" id="first_name" class="mt-[2px] drop-shadow-lg focus:outline-none focus:ring-0 focus:border-gray-500 pl-3 pb-[5px] pt-1 bg-[#E7EBEE] rounded-[6px] border border-black/15 text-gray-900 text-[15px] w-full h-8 dark:bg-white-700 text-black" placeholder="Type Income |" required />
        </div>
        </div>
        </>
    );
}

export default Income;