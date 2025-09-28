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
    const [currentBudget, setCurrentBudget] = useState(0);
    const [dailyBudget, setDailyBudget] = useState(0);
    const [amount, setAmount] = useState('');
    const [tagId, setTagId] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [enableDailyBudget, setEnableDailyBudget] = useState(true);

    console.log('Wallet ID from URL:', walletId);

    useEffect(() => {
        const getWalletInfo = async () => {
            try {
                if (walletId) {
                    console.log('Fetching wallet info for:', walletId);

                    const { data: wallet, error: walletError } = await supabase
                        .from('Wallet')
                        .select('WalletName, WalletType, DailyAvaliable')
                        .eq('Wallet_id', walletId)
                        .single();

                    if (walletError) {
                        console.error('Error fetching wallet:', walletError);
                        console.log('Wallet error details:', walletError);
                    } else if (wallet) {
                        console.log('Wallet data received:', wallet);
                        setWalletType(wallet.WalletType || '');
                        setWalletName(wallet.WalletName || '');
                        setEnableDailyBudget(wallet.DailyAvaliable !== null);
                    } else {
                        console.log('No wallet data returned');
                    }

                    const { data: expenseWallet, error: budgetError } = await supabase
                        .from('ExpenseWallet')
                        .select('Budget')
                        .eq('Wallet_id', walletId)
                        .single();

                    if (budgetError) {
                        console.error('Error fetching Budget:', budgetError);
                        console.log('Budget error details:', budgetError);
                    } else if (expenseWallet) {
                        console.log('Budget data received:', expenseWallet);
                        setCurrentBudget(expenseWallet.Budget || 0);
                        setDailyBudget((expenseWallet.Budget || 0) / 30);
                    } else {
                        console.log('No budget data returned');
                    }
                } else {
                    console.error('No wallet ID found in URL');
                }
            } catch (error) {
                console.error('Error getting wallet info:', error);
            }
        };
        getWalletInfo();
    }, [walletId]);

    const handleClose = () => {
        if (walletId && walletType) {
            navigate(`/expense-wallet/${walletId}`);
        } else {
            navigate("/walletlist");
        }
    };

    const updateDailyBudget = async (walletId, newDailyBudget) => {
        if (enableDailyBudget) {
            const { error } = await supabase
                .from('Wallet')
                .update({ DailyAvaliable: newDailyBudget })
                .eq('Wallet_id', walletId);

            if (error) {
                console.error('Failed to update daily budget:', error);
            }
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
        if (amountNum > currentBudget) {
            throw new Error(`Insufficient budget. Current: $${currentBudget}`);
        }
        return true;
    };

    const checkBudget = (walletId, newBudget) => {
        if (newBudget < 0) {
            throw new Error('Budget cannot be negative');
        }
        return true;
    };

    const checkDailyBudget = (walletId, dailyBudget) => {
        if (enableDailyBudget && dailyBudget < 0) {
            throw new Error('Daily budget exceeded');
        }
        return true;
    };

    const calcBudget = (currentBudget, txAmount) => {
        return currentBudget - txAmount;
    };

    const calcDailyBudget = (newBudget) => {
        return newBudget / 30;
    }

    const updateBudget = async (walletId, newBudget) => {
        const { error } = await supabase
            .from('ExpenseWallet')
            .update({ Budget: newBudget })
            .eq('Wallet_id', walletId)

        if (error) {
            throw new Error('Failed to update budget: ' + error.message);
        }
        return newBudget;
    };

    const insertExpense = async (walletId, tagId, txAmount, note) => {
        const transactionId = crypto.randomUUID();
        const { data: txType, error: txTypeError } = await supabase
            .from("TxType")
            .select("TxType_id")
            .eq("TxType", "Expense")
            .single();

        if (txTypeError) {
            console.error('TxType error details:', txTypeError);
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

    const showNewExpense = (transactionData) => {
        alert(`Expense of $${amount} added successfully!`);
    }

    const showUpdatedBudget = (newBudget, newDailyBudget) => {
        if (enableDailyBudget) {
            alert(`Remaining Budget: $${newBudget.toFixed(2)}\nDaily Budget: $${newDailyBudget.toFixed(2)}`);
        } else {
            alert(`Remaining Budget: $${newBudget.toFixed(2)}`);
        }
    };

    const addExpense = async (walletId, tagId, txAmount, note) => {
        setLoading(true);
        try {
            validateExpense(walletId, tagId, txAmount, note);
            validateNote(note);
            const newBudget = calcBudget(currentBudget, txAmount);
            checkBudget(walletId, newBudget);
            const newDailyBudget = calcDailyBudget(newBudget);
            checkDailyBudget(walletId, newDailyBudget);

            const transactionData = await insertExpense(walletId, tagId, txAmount, note);
            if (transactionData && transactionData[0] && transactionData[0].Tx_id) {
                // showCreateTransactionSuccess
                alert(`Transaction ${transactionData[0].Tx_id} created successfully!`);
            } else {
                // showCreateTransactionError
                throw new Error('Transaction creation failed - no transaction ID returned');
            }
            const updatedBudget = await updateBudget(walletId, newBudget);
            await updateDailyBudget(walletId, newDailyBudget);

            setCurrentBudget(updatedBudget);
            setDailyBudget(newDailyBudget);

            showNewExpense(transactionData);
            showUpdatedBudget(updatedBudget, newDailyBudget);

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
        await addExpense(walletId, tagId, parseFloat(amount), note);
    };

    // isNAN is to prevent NaN
    const getButtonText = () => {
        if (loading) {
            return 'Processing...';
        }
        const displayAmount = amount && !isNaN(parseFloat(amount))
            ? parseFloat(amount).toLocaleString()
            : '0';
        return `Add Expense - $${displayAmount}`;
    };

    const validateNote = (note) => {
        if (note && (note.length < 1 || note.length > 20)) {
            throw new Error('Note must be between 1 and 20 characters');
        }
        return true;
    };

    return (
        <>
            <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
                <div className="mt-30 w-[632px] h-[380px] bg-white border border-black/25 rounded-[10px] drop-shadow-lg">
                    <div className="flex justify-end border-b border-black/25 px-4 py-2 drop-shadow-lg ">
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
                            Type: {walletType || 'Unknown'} | Budget: ${currentBudget.toLocaleString()}
                        </div>
                        {enableDailyBudget && (
                            <div className="text-[12px] text-blue-600 mt-1">
                                Daily Budget: ${dailyBudget.toFixed(2)}
                            </div>
                        )}
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
                                disabled={loading || !amount}
                                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${loading || !amount
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
        </>
    );
}

export default AddExpenseTrans;