import "../../tailwind.css";

function Income({ onAmountChange }) {
    const handleAmountChange = (e) => {
        onAmountChange(e.target.value);
    };

    return (
        <>
            <div className="relative group">
                <div>
                    <label htmlFor="income_amount" className="block text-[16px] text-gray-900 text-black">
                        Income
                    </label>
                    <input
                        type="number"
                        id="income_amount"
                        className="mt-[2px] drop-shadow-lg focus:outline-none focus:ring-0 focus:border-gray-500 pl-3 pb-[5px] pt-1 bg-[#E7EBEE] rounded-[6px] border border-black/15 text-gray-900 text-[15px] w-full h-8 dark:bg-white-700 text-black"
                        placeholder="Type Income Amount"
                        required
                        onChange={handleAmountChange}
                    />
                </div>
            </div>
        </>
    );
}

export default Income;