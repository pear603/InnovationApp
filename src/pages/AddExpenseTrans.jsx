import "../tailwind.css";
import BalanceAll from "../components/BalanceAll";
import SelectTag from "../components/Ohma/SelectTag";
import Income from "../components/Ohma/Income";
import Notes from "../components/Ohma/Notes";
import InsertBtn from "../components/Ohma/InsertBtn";
import ExpenseBtn from "../components/Ohma/ExpenseBtn";
import Spendings from "../components/Ohma/Spendings";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';
import { useEffect, useState } from "react";


function AddExpenseTrans() {
    const navigate = useNavigate();
    const { id: walletId } = useParams();
    const [walletType, setWalletType] = useState('');
    const [walletName, setWalletName] = useState(null);
    const [currentBudget, setCurrentBudget] = useState(0);
    const [dailyBudget, setDailyBudget] = useState(0);
    const [amount, setAmount] = useState(0);
    const [tagId, setTagId] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [enableDailyBudget, setEnableDailyBudget] = useState(true);

    useEffect(() => {
        const getWalletInfo = async () => {
            try {
                if (walletId) {
                    const { data: wallet, error: walletError } = await supabase
                        .from('Wallet')
                        .select('WalletName', 'WalletType', 'DailyAvaliable')
                        .eq('Wallet_id', walletId)
                        .single();
                    if (walletError) {
                        console.error('Error fetching wallet:', walletError);
                    }
                    else if (wallet) {
                        setWalletType(wallet.WalletType);
                        setWalletName(wallet.WalletName);
                        setEnableDailyBudget(wallet.enableDailyBudget !== null);
                    }
                    //fetch Budget
                    const { data: expenseWallet, error: budgetError } = await supabase
                        .from('ExpenseWallet')
                        .select('Budget')
                        .eq("Wallet_id", walletId)
                        .single();
                    if (budgetError) {
                        console.error('Error fetching Budget:', budgetError);
                    } else if (expenseWallet) {
                        setCurrentBudget(expenseWallet.Budget || 0);
                        setDailyBudget((expenseWallet.Budget || 0) / 30);
                    }
                }

            } catch (error) {
                console.error('Errpr getting wallet info')
            }
        };
        getWalletInfo();
        //v run the useEffect whenever walletID changes
    }, [walletId]);

    const handleClose = () => {
        if (walletId && walletType) {
            navigate('/expense-wallet/${walletId}');
        }
        else {
            navigate("/walletlist");
        }
    };

    const validateExpense = async (walletId, tagId, txAmount, note) => {
        if (!walletId) {
            throw new Error('Wallet ID is required');
        }
        if (!tagId) {
            throw new Error('Please select a tag');
        }
        if (!txAmount || txAmount <= 0) {
            throw new Error('Please enter a valid amount');
        }
        if (txAmount > currentBudget) {
            throw new Error('Insufficient budget.');
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
            .eq("TxType", 'Expense')
            .single();

        if (transactionError) {
            throw new Error("Could not fetch expense type-ID, please try again later");
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
        console.log('New expense added:', transactionData);
        alert(`Expense of $${amount} added successfully!`);
    }

    const showUpdatedBudget = (newBudget, newDailyBudget) => {
        console.log('Updated budget:', newBudget);
        console.log('Updated daily budget:', newDailyBudget);

        if (enableDailyBudget) {
            alert('Remaining Budget: $${newBudget.toFixed(2)}\nDaily Budget: $${newDailyBudget.toFixed(2)}');
        } else {
            alert(`Remaining Budget: $${newBudget.toFixed(2)}`);
        }
    };

    const addExpense = async (walletId, tagId, txAmount, note) => {
        setLoading(true);
        try {
            //(Sequence)
            // Step 1: Validate expense
            validateExpense(walletId, tagId, txAmount, note);

            // Step 2: Calculate new budget
            const newBudget = calcBudget(currentBudget, txAmount);

            // Step 3: Check budget constraints
            checkBudget(walletId, newBudget);

            // Step 4: Calculate daily budget
            const newDailyBudget = calcDailyBudget(newBudget);

            // Step 5: Check daily budget constraints
            checkDailyBudget(walletId, newDailyBudget);

            // Step 6: Insert expense transaction
            const transactionData = await insertExpense(walletId, tagId, txAmount, note);

            // Step 7: Update budget
            const updatedBudget = await updateBudget(walletId, newBudget);

            // Step 8: Update daily budget (if enabled)
            await updateDailyBudget(walletId, newDailyBudget);

            // Update local state
            setCurrentBudget(updatedBudget);
            setDailyBudget(newDailyBudget);

            // Show success message
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
        await addExpense(walletId, tagId, parseFloat(amount), note);
    };

    return (
        <>
            <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
                <div className="mt-30 w-[632px] h-[380px] bg-white border border-black/25 rounded-[10px] drop-shadow-lg">
                    <div className="flex justify-end border-b border-black/25 px-4 py-2 drop-shadow-lg ">
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={handleClose}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Wallet Info Section */}
                    <div className="ml-8 mt-3">
                        <div className="text-[20px] font-[400]">
                            {walletName || 'Loading...'}
                        </div>
                        <div className="text-[14px] text-gray-600 mt-1">
                            Type: {walletType} | Budget: ${currentBudget.toLocaleString()}
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
                        <div className="mt-6 ml-118">
                            <button
                                onClick={handleAddExpense}
                                disabled={loading}
                                className={`px-6 py-2 rounded font-medium ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                {loading ? 'Processing...' : `Add Expense - $${amount || '0'}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddExpenseTrans