import "../../tailwind.css";
import { Link } from "react-router-dom";
function Notes({ onNoteChange }) {

    const handleNoteChange = (e) => {
        onNoteChange(e.target.value);
    }
    return (
        <>
            <div class="relative group">
                <div>
                    <label htmlFor="notes" class="block mb-1 mt-1 text-[15px] text-gray-900 text-black">Notes</label>
                    <input
                        type="text"
                        id="first_name"
                        class="focus:outline-none focus:ring-0 focus:border-gray-500
                         border border-black/15 pl-4 pb-1 bg-[#E7EBEE] drop-shadow-lg 
                         rounded-[6px] text-gray-900 text-[14px] 
                         w-full h-8 dark:bg-white-700 text-black"
                        placeholder="Note"
                        required
                        onChange={handleNoteChange}
                    />
                </div>
            </div>
        </>
    );
}

export default Notes;