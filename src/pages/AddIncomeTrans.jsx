import "../tailwind.css";
import SelectTag from "../components/Ohma/SelectTag";
import Notes from "../components/Ohma/Notes";
import Income from "../components/Ohma/Income";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';
import { useEffect, useState } from "react";

function AddIncomeTrans() {
    const navigate = useNavigate();
    const { id: walletId } = useParams();
    const [walletType, setWalletType] = useState('');
    const [walletName, setWalletName] = useState('');
    const [currentGoal, setCurrentGoal] = useState(0);
    const [amount, setAmount] = useState('');
    const [tagId, setTagId] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    console.log('Wallet ID from URL:', walletId);

    useEffect(() => {
        const getWalletInfo = async () => {
            try {
                if (!walletId) {
                    console.error('No wallet ID found in URL');
                    setFetchLoading(false);
                    return;
                }

                console.log('Fetching wallet info for:', walletId);

                // Fetch wallet basic info
                const { data: wallet, error: walletError } = await supabase
                    .from('Wallet')
                    .select('WalletName, WalletType, DailyAvaliable')
                    .eq('Wallet_id', walletId)
                    .single();

                if (walletError) {
                    console.error('Error fetching wallet:', walletError);
                    alert('Error loading wallet information');
                } else if (wallet) {
                    console.log('Wallet data received:', wallet);
                    setWalletType(wallet.WalletType || '');
                    setWalletName(wallet.WalletName || '');
                }

                // Fetch goal from IncomeWallet table
                const { data: incomeWallet, error: goalError } = await supabase
                    .from('IncomeWallet')
                    .select('Goal')
                    .eq('Wallet_id', walletId)
                    .single();

                if (goalError) {
                    console.error('Error fetching Goal:', goalError);
                } else if (incomeWallet) {
                    console.log('Goal data received:', incomeWallet);
                    setCurrentGoal(incomeWallet.Goal || 0);
                }
            } catch (error) {
                console.error('Error getting wallet info:', error);
                alert('Error loading wallet data');
            } finally {
                setFetchLoading(false);
            }
        };

        getWalletInfo();
    }, [walletId]);

    const handleClose = () => {
        if (walletId && walletType) {
            // Navigate back based on wallet type
            switch (walletType.toLowerCase()) {
                case 'expense':
                    navigate(`/expense-wallet/${walletId}`);
                    break;
                case 'income':
                    navigate(`/income-wallet/${walletId}`);
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

    const validateIncome = (walletId, tagId, txAmount, note) => {
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
        return true;
    };

    const updateGoal = async (walletId, newGoal) => {
        const { error } = await supabase
            .from('IncomeWallet')
            .update({ Goal: newGoal })
            .eq('Wallet_id', walletId)

        if (error) {
            throw new Error('Failed to update goal: ' + error.message);
        }
        return newGoal;
    };

    const insertIncome = async (walletId, tagId, txAmount, note) => {
        const transactionId = crypto.randomUUID();

        // Get TxType_id for "Income"
        const { data: txType, error: txTypeError } = await supabase
            .from("TxType")
            .select("TxType_id")
            .eq("TxType", "Income")
            .single();

        if (txTypeError) {
            console.error('TxType error details:', txTypeError);
            throw new Error("Could not fetch income type-ID: " + txTypeError.message);
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

    const addIncome = async (walletId, tagId, txAmount, note) => {
        setLoading(true);
        try {
            validateIncome(walletId, tagId, txAmount, note);
            validateNote(note);
            const newGoal = currentGoal + parseFloat(txAmount);
            const transactionData = await insertIncome(walletId, tagId, txAmount, note);
            if (transactionData && transactionData[0] && transactionData[0].Tx_id) {
                // showCreateTransactionSuccess
                alert(`Transaction ${transactionData[0].Tx_id} created successfully!`);
            } else {
                // showCreateTransactionError
                throw new Error('Transaction creation failed - no transaction ID returned');
            }
            const updatedGoal = await updateGoal(walletId, newGoal);

            setCurrentGoal(updatedGoal);

            alert(`Income of $${txAmount} added successfully!`);
            alert(`Updated Goal: $${updatedGoal.toFixed(2)}`);

            return transactionData;
        } catch (error) {
            console.error('Error adding income:', error);
            alert(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleAddIncome = async () => {
        if (!amount) {
            alert('Please enter an amount');
            return;
        }
        await addIncome(walletId, tagId, parseFloat(amount), note);
    };

    const getButtonText = () => {
        if (loading) {
            return 'Processing...';
        }
        const displayAmount = amount && !isNaN(parseFloat(amount))
            ? parseFloat(amount).toLocaleString()
            : '0';
        return `Add Income - $${displayAmount}`;
    };


    const validateNote = (note) => {
        if (note && (note.length < 1 || note.length > 20)) {
            throw new Error('Note must be between 1 and 20 characters');
        }
        return true;
    };

    if (fetchLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#E2EFF3]">
                <div>Loading wallet information...</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
                <div className="mt-30 w-[632px] h-[350px] bg-white border border-black/25 rounded-[10px] drop-shadow-lg">
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
                            Type: {walletType || 'Unknown'} | Current Goal: ${currentGoal.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex flex-col ml-8 mt-3 text-[15px]">
                        <div className="grid grid-cols-6 gap-1">
                            <div className="col-span-2">
                                <SelectTag onTagSelect={setTagId} />
                            </div>
                            <div className="col-span-4 w-90">
                                <Income onAmountChange={setAmount} />
                            </div>
                        </div>
                        <div className="w-140 mt-3">
                            <Notes onNoteChange={setNote} />
                        </div>
                        <div className="mt-6 ml-82 flex justify-center">
                            <button
                                onClick={handleAddIncome}
                                disabled={loading || !amount}
                                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${loading || !amount
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
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

export default AddIncomeTrans;

