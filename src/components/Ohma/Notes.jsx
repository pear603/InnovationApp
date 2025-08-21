import "../../tailwind.css";
import { Link } from "react-router-dom";
function Notes() {
    return (
        <>
        <div class="relative group">
        <div>
            <label for="first_name" class="block mb-1 text-[45px] text-gray-900 text-black">Notes</label>
            <input type="text" id="first_name" class="focus:outline-none focus:ring-0 focus:border-gray-500 pl-10 bg-[#E7EBEE] drop-shadow-2xl border-0 rounded-[25px] text-gray-900 text-[45px] rounded-[20px] w-551 h-30 p-2.5 dark:bg-white-700 text-black" placeholder="Note |" required />
        </div>
        </div>
        </>
    );
}

export default Notes;