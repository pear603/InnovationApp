import "../../tailwind.css";

function Spendings({ onAmountChange }) {
    const handleAmountChange = (e) => {
        onAmountChange(e.target.value);
    };

    return (
        <>
            <div className="relative group"> {/* FIXED: class → className */}
                <div>
                    <label htmlFor="spending_amount" className="block text-[16px] text-gray-900 text-black"> {/* FIXED: for → htmlFor, class → className */}
                        Spending
                    </label>
                    <input
                        type="number"
                        id="spending_amount"
                        className="mt-[2px] drop-shadow-lg focus:outline-none focus:ring-0 focus:border-gray-500 pl-3 pb-[5px] pt-1 bg-[#E7EBEE] rounded-[6px] border border-black/15 text-gray-900 text-[15px] w-full h-8 dark:bg-white-700 text-black"
                        placeholder="Type Spending"
                        required
                        onChange={handleAmountChange}
                    />
                </div>
            </div>
        </>
    );
}

export default Spendings;