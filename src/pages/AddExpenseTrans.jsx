import "../tailwind.css";
import SelectTag from "../components/Ohma/SelectTag";
import Notes from "../components/Ohma/Notes";
import Spendings from "../components/Ohma/Spendings";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';
import { useEffect, useState } from "react";

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
    const [enableDailyBudget, setEnableDailyBudget] = useState(true);
    const [startDate, setStartDate] = useState('');

    const calculateDaysLeft = (startDateString) => {
        if (!startDateString) return 30; // Default fallback

        const start = new Date(startDateString);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const today = new Date();
        const timeDiff = end.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return Math.max(0, daysLeft); // Don't go below 0
    };

    useEffect(() => {
        const getWalletInfo = async () => {
            try {
                if (walletId) {
                    console.log('Fetching wallet info for:', walletId);


                    const { data: wallet, error: walletError } = await supabase
                        .from('Wallet')
                        .select('WalletName, WalletType, DailyAvaliable, StartDate')
                        .eq('Wallet_id', walletId)
                        .single();

                    if (walletError) {
                        console.error('Error fetching wallet:', walletError);
                    } else if (wallet) {
                        console.log('Wallet data received:', wallet);
                        setWalletType(wallet.WalletType || '');
                        setWalletName(wallet.WalletName || '');
                        setEnableDailyBudget(wallet.DailyAvaliable !== null);
                        setStartDate(wallet.StartDate || new Date().toISOString());
                        const daysLeft = calculateDaysLeft(wallet.StartDate);
                        setDaysLeft(daysLeft);
                        console.log('Days left calculated:', daysLeft, 'from StartDate:', wallet.StartDate);
                    }

                    const { data: expenseWallet, error: budgetError } = await supabase
                        .from('ExpenseWallet')
                        .select('Budget')
                        .eq('Wallet_id', walletId)
                        .single();

                    if (budgetError) {
                        console.error('Error fetching Budget:', budgetError);
                    } else if (expenseWallet) {
                        const originalBudget = expenseWallet.Budget || 0;
                        setOriginalBudget(originalBudget);

                        // Calculate total spent from transactions
                        const { data: transactions, error: txError } = await supabase
                            .from('Transaction')
                            .select('TxAmount, TxType:TxType_id(TxType)')
                            .eq('Wallet_id', walletId);

                        if (!txError && transactions) {
                            const totalSpent = transactions
                                .filter(tx => tx.TxType?.TxType === 'Expense')
                                .reduce((sum, tx) => sum + (tx.TxAmount || 0), 0);

                            setCurrentSpent(totalSpent);
                            const remaining = originalBudget - totalSpent;
                            setRemainingBudget(remaining);

                            // Calculate daily budget based on actual days left
                            const daysLeft = calculateDaysLeft(wallet?.StartDate);
                            const dailyBudget = daysLeft > 0 ? remaining / daysLeft : remaining;
                            setDailyBudget(dailyBudget);

                            console.log('Budget calculated:', {
                                original: originalBudget,
                                spent: totalSpent,
                                remaining: remaining,
                                daysLeft: daysLeft,
                                daily: dailyBudget
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error getting wallet info:', error);
            }
        };
        getWalletInfo();
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

    const validateExpense = (walletId, tagId, txAmount, note) => {
        if (!walletId) {
            throw new Error('Wallet ID is required');
        }
        if (!tagId) {
            throw new Error('Please select a tag');
        }

        const amountNum = parseFloat(txAmount);
        if (!txAmount || isNaN(amountNum) || amountNum <= 0) {
            throw new Error('Please enter a valid amount (numbers only)');
        }
        if (amountNum > remainingBudget) {
            throw new Error(`Insufficient budget. Remaining: $${remainingBudget.toFixed(2)}`);
        }
        return true;
    };

    const calcRemainingBudget = (currentRemaining, txAmount) => {
        return currentRemaining - txAmount;
    };

    const calcDailyBudget = (newRemainingBudget, daysLeft) => {
        return daysLeft > 0 ? newRemainingBudget / daysLeft : newRemainingBudget;
    };

    const insertExpense = async (walletId, tagId, txAmount, note) => {
        const transactionId = crypto.randomUUID();
        const { data: txType, error: txTypeError } = await supabase
            .from("TxType")
            .select("TxType_id")
            .eq("TxType", "Expense")
            .single();

        if (txTypeError) {
            throw new Error("Could not fetch expense type-ID: " + txTypeError.message);
        }

        const { data: transactionData, error: transactionError } = await supabase
            .from('Transaction')
            .insert([
                {
                    TxNote: note,
                    TxAmount: txAmount,
                    CreatedDate: new Date().toISOString(),
                    Wallet_id: walletId,
                    Tx_id: transactionId,
                    Tag_id: tagId,
                    TxType_id: txType.TxType_id
                }
            ])
            .select()

        if (transactionError) {
            throw new Error('Failed to add transaction: ' + transactionError.message);
        }
        return transactionData;
    };

    const addExpense = async (walletId, tagId, txAmount, note) => {
        setLoading(true);
        try {
            validateExpense(walletId, tagId, txAmount, note);

            const newRemainingBudget = calcRemainingBudget(remainingBudget, txAmount);
            const newDaysLeft = calculateDaysLeft(startDate);
            const newDailyBudget = calcDailyBudget(newRemainingBudget, newDaysLeft);

            const transactionData = await insertExpense(walletId, tagId, txAmount, note);
            if (transactionData && transactionData[0] && transactionData[0].Tx_id) {
                alert(`Expense of $${amount} added successfully!`);

                // Update local state
                setRemainingBudget(newRemainingBudget);
                setDailyBudget(newDailyBudget);
                setDaysLeft(newDaysLeft);
                setCurrentSpent(currentSpent + txAmount);

                setTimeout(() => {
                    handleClose();
                }, 1000);
            } else {
                throw new Error('Transaction creation failed');
            }

            return transactionData;
        } catch (error) {
            console.error('Error adding expense:', error);
            alert(error.message);
            throw error;
        } finally {
            setLoading(false);
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
        await addExpense(walletId, tagId, parseFloat(amount), note);
    };

    const getButtonText = () => {
        if (loading) {
            return 'Processing...';
        }
        const displayAmount = amount && !isNaN(parseFloat(amount))
            ? parseFloat(amount).toLocaleString()
            : '0';
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
                        Remaining: ${remainingBudget.toFixed(2)} | Spent: ${currentSpent.toFixed(2)}
                    </div>
                    <div className="text-[12px] text-blue-600 mt-1">
                        Daily: ${dailyBudget.toFixed(2)} | Days Left: {daysLeft}
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