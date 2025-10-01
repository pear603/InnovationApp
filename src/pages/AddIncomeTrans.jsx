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
    const [monthlyGoal, setMonthlyGoal] = useState(0);
    const [currentSaved, setCurrentSaved] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(0);
    const [amount, setAmount] = useState('');
    const [tagId, setTagId] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const calculateDaysLeft = (startDateString) => {
        if (!startDateString) return 30;
        const start = new Date(startDateString);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        const today = new Date();
        const timeDiff = end.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return Math.max(0, daysLeft);
    };

    useEffect(() => {
        const getWalletInfo = async () => {
            try {
                if (walletId) {
                    console.log('Fetching wallet info for:', walletId);

                    const { data: wallet, error: walletError } = await supabase
                        .from('Wallet')
                        .select('WalletName, WalletType, StartDate')
                        .eq('Wallet_id', walletId)
                        .single();

                    if (walletError) {
                        console.error('Error fetching wallet:', walletError);
                    } else if (wallet) {
                        console.log('Wallet data received:', wallet);
                        setWalletType(wallet.WalletType || '');
                        setWalletName(wallet.WalletName || '');

                        const daysLeft = calculateDaysLeft(wallet.StartDate);
                        setDaysLeft(daysLeft);
                    }

                    // Get monthly goal from IncomeWallet
                    const { data: incomeWallet, error: goalError } = await supabase
                        .from('IncomeWallet')
                        .select('Goal')
                        .eq('Wallet_id', walletId)
                        .single();

                    if (goalError) {
                        console.error('Error fetching Goal:', goalError);
                    } else if (incomeWallet) {
                        const monthlyGoal = incomeWallet.Goal || 0;
                        setMonthlyGoal(monthlyGoal);

                        // Calculate total saved from income transactions
                        const { data: transactions, error: txError } = await supabase
                            .from('Transaction')
                            .select('TxAmount, TxType:TxType_id(TxType)')
                            .eq('Wallet_id', walletId);

                        if (!txError && transactions) {
                            const totalSaved = transactions
                                .filter(tx => tx.TxType?.TxType === 'Income')
                                .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);

                            setCurrentSaved(totalSaved);

                            // Calculate daily goal
                            const dailyGoal = daysLeft > 0 ? Math.floor((monthlyGoal - totalSaved) / daysLeft) : 0;
                            setDailyGoal(dailyGoal);

                            console.log('Income data calculated:', {
                                monthlyGoal: monthlyGoal,
                                saved: totalSaved,
                                daysLeft: daysLeft,
                                dailyGoal: dailyGoal
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

    const insertIncome = async (walletId, tagId, txAmount, note) => {
        const transactionId = crypto.randomUUID();

        const { data: txType, error: txTypeError } = await supabase
            .from("TxType")
            .select("TxType_id")
            .eq("TxType", "Income")
            .single();

        if (txTypeError) {
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

            const transactionData = await insertIncome(walletId, tagId, txAmount, note);
            if (transactionData && transactionData[0] && transactionData[0].Tx_id) {
                alert(`Income of $${amount} added successfully!`);

                // Update local state
                const newSaved = currentSaved + parseFloat(txAmount);
                setCurrentSaved(newSaved);

                // Recalculate daily goal
                const newDailyGoal = daysLeft > 0 ? Math.floor((monthlyGoal - newSaved) / daysLeft) : 0;
                setDailyGoal(newDailyGoal);

                setTimeout(() => {
                    handleClose();
                }, 1000);
            } else {
                throw new Error('Transaction creation failed');
            }

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
        if (!tagId) {
            alert('Please select a tag');
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
                        Monthly Goal: ${monthlyGoal.toLocaleString()}
                    </div>
                    <div className="text-[14px] text-green-600 mt-1">
                        Currently Saved: ${currentSaved} | Remaining: ${(monthlyGoal - currentSaved)}
                    </div>
                    <div className="text-[12px] text-blue-600 mt-1">
                        Daily Goal: ${dailyGoal} | Days Left: {daysLeft}
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
                            disabled={loading || !amount || !tagId}
                            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${loading || !amount || !tagId
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
    );
}

export default AddIncomeTrans;