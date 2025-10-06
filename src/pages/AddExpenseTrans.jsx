import "../tailwind.css";
import SelectTag from "../components/Ohma/SelectTag";
import Notes from "../components/Ohma/Notes";
import Spendings from "../components/Ohma/Spendings";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TransactionService } from '../components/TransactionService';

function AddExpenseTrans() {
    const navigate = useNavigate();
    const { id: walletId } = useParams();

    const [walletType, setWalletType] = useState('');
    const [walletName, setWalletName] = useState('');
    const [originalBudget, setOriginalBudget] = useState(0);
    const [currentSpent, setCurrentSpent] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);
    const [dailyBudget, setDailyBudget] = useState(0);
    const [amount, setAmount] = useState('');
    const [tagId, setTagId] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const walletData = await TransactionService.validateWalletType(walletId);
                if (walletData) {
                    setWalletName(walletData.walletName);
                    setWalletType(walletData.walletType);
                    setOriginalBudget(walletData.originalBudget || 0);
                    setCurrentSpent(walletData.currentSpent || 0);
                    setRemainingBudget(walletData.remainingBudget || 0);
                    setDaysLeft(walletData.daysLeft || 0);
                    setDailyBudget(walletData.dailyBudget || 0);
                }
            } catch (err) {
                console.error('Error fetching wallet info:', err);
            }
        };
        fetchWallet();
    }, [walletId]);

    const handleClose = () => {
        if (walletId && walletType) {
            switch (walletType.toLowerCase()) {
                case 'expense':
                    navigate(`/expense-wallet/${walletId}`);
                    break;
                case 'both':
                    navigate(`/both-wallet/${walletId}`);
                    break;
                default:
                    navigate("/walletlist");
            }
        } else {
            navigate("/walletlist");
        }
    };

    const handleAddExpense = async () => {
        if (!amount) {
            alert('Please enter an amount');
            return;
        }
        if (!tagId) {
            alert('Please select a tag');
            return;
        }

        setLoading(true);
        try {
            // Validate 
            TransactionService.validateExpense(walletId, tagId, parseFloat(amount));
            TransactionService.validateNote(note);

            // Insert transaction
            const transactionData = await TransactionService.insertTransaction(walletId, tagId, parseFloat(amount), note, 'Expense');

            if (transactionData && transactionData[0]?.Tx_id) {
                alert(`Expense of $${amount} added successfully!`);

                // Update
                const newCurrentSpent = currentSpent + parseFloat(amount);
                const newRemainingBudget = remainingBudget - parseFloat(amount);
                const newDailyBudget = TransactionService.calcDailyBudget(newRemainingBudget, daysLeft);

                setCurrentSpent(newCurrentSpent);
                setRemainingBudget(newRemainingBudget);
                setDailyBudget(newDailyBudget);

                setTimeout(() => handleClose(), 1000);
            } else {
                throw new Error('Transaction creation failed');
            }
        } catch (err) {
            alert(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getButtonText = () => {
        if (loading) return 'Processing...';
        const displayAmount = amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString() : '0';
        return `Add Expense - $${displayAmount}`;
    };
    return (
        <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
            <div className="mt-30 w-[632px] h-[420px] bg-white border border-black/25 rounded-[10px] drop-shadow-lg">
                <div className="flex justify-end border-b border-black/25 px-4 py-2">
                    <button
                        className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Wallet Info Section */}
                <div className="ml-8 mt-3">
                    <div className="text-[27px] font-[400]">
                        {walletName || 'Loading Wallet...'}
                    </div>
                    <div className="text-[14px] text-gray-600 mt-1">
                        Original Budget: ${originalBudget.toLocaleString()}
                    </div>
                    <div className="text-[14px] text-green-600 mt-1">
                        Remaining: ${remainingBudget} | Spent: ${currentSpent}
                    </div>
                    <div className="text-[12px] text-blue-600 mt-1">
                        Daily: ${dailyBudget} | Days Left: {daysLeft}
                    </div>
                </div>

                <div className="flex flex-col ml-8 mt-3 text-[15px]">
                    <div className="grid grid-cols-6 gap-1">
                        <div className="col-span-2">
                            <SelectTag onTagSelect={setTagId} />
                        </div>
                        <div className="col-span-4 w-90">
                            <Spendings onAmountChange={setAmount} />
                        </div>
                    </div>
                    <div className="w-140 mt-3">
                        <Notes onNoteChange={setNote} />
                    </div>
                    <div className="mt-6 ml-82 flex justify-center">
                        <button
                            onClick={handleAddExpense}
                            disabled={loading || !amount || !tagId}
                            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${loading || !amount || !tagId
                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                }`}
                        >
                            {getButtonText()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpenseTrans;