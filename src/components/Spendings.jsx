import "../tailwind.css";
import { Link } from "react-router-dom";
function Spendings() {
    return (
        <>
        <div class="relative group">
        <div>
            <label for="first_name" class="block mb-1 text-[45px] text-gray-900 text-black">Spending</label>
            <input type="text" id="first_name" class="focus:outline-none focus:ring-0 focus:border-gray-500 pl-10 bg-gray-50 border-2 rounded-[25px] text-gray-900 text-[45px] rounded-[20px] w-173 h-30 p-2.5 dark:bg-white-700 text-black" placeholder="Type Spending" required />
        </div>
        </div>
        </>
    );
}

export default Spendings;