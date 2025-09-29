import { useNavigate, useParams } from "react-router-dom";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import SelectTag from "../components/Ohma/SelectTag";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import Spendings from "../components/Ohma/Spendings";
import Notes from "../components/Ohma/Notes";
import Insert from "../components/Ohma/Insert";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import "../tailwind.css";
import Transaction from "../components/Ohma/Transaction";
import { useEffect, useState } from "react";
import { supabase } from '../assets/supabaseClient';
import Pagination from "../components/Ohma/Pagination";


function IncomeWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [currentSaved, setCurrentSaved] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [loading, setLoading] = useState(false);

  const TRANSACTIONS_PER_PAGE = 10;

  // Calculate remaining amount to reach goal
  const remainingToGoal = monthlyGoal - currentSaved;

  const calculateDaysLeft = (startDate) => {
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + 1);
    const today = new Date();
    const daysLeft = Math.ceil((end - today) / (1000 * 3600 * 24));
    return Math.max(0, daysLeft);
  };

  // Fetch total saved from ALL income transactions
  const fetchTotalSaved = async (walletId) => {
    const { data: allTransactions, error } = await supabase
      .from('Transaction')
      .select('TxAmount, TxType_id')
      .eq('Wallet_id', walletId);

    if (allTransactions && !error) {
      // Get income type ID
      const { data: incomeType } = await supabase
        .from('TxType')
        .select('TxType_id')
        .eq('TxType', 'Income')
        .single();

      if (incomeType) {
        const totalSaved = allTransactions
          .filter(tx => tx.TxType_id === incomeType.TxType_id)
          .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);

        setCurrentSaved(totalSaved);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Get wallet info
        const { data: wallet, error: walletError } = await supabase
          .from('Wallet')
          .select('WalletName, StartDate, DailyAvaliable')
          .eq('Wallet_id', id)
          .single();

        console.log('Wallet data:', wallet);
        console.log('Wallet error:', walletError);

        if (walletError) {
          console.error('Error fetching wallet:', walletError);
          setWalletName('Wallet Not Found');
        } else if (wallet) {
          setWalletName(wallet.WalletName || 'Unnamed Wallet');
          const days = calculateDaysLeft(wallet.StartDate);
          setDaysLeft(days);

          // Calculate daily goal based on remaining goal and days left
          const dailyGoal = days > 0 ? (monthlyGoal - currentSaved) / days : 0;
          setDailyGoal(dailyGoal);
        } else {
          setWalletName('Wallet Not Found');
        }

        // Get monthly goal from IncomeWallet
        const { data: incomeWallet, error: budgetError } = await supabase
          .from('IncomeWallet')
          .select('Goal')
          .eq('Wallet_id', id)
          .single();

        console.log('IncomeWallet data:', incomeWallet);
        console.log('Goal error:', budgetError);

        if (incomeWallet) {
          setMonthlyGoal(incomeWallet.Goal || 0);
        } else {
          setMonthlyGoal(0);
        }

        // Fetch total saved
        await fetchTotalSaved(id);

        // Get paginated transactions
        const from = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = from + TRANSACTIONS_PER_PAGE - 1;

        const { data: transactions, error, count } = await supabase
          .from('Transaction')
          .select(`
            *,
            Tag:Tag_id (Name),
            TxType:TxType_id (TxType)
          `, { count: 'exact' })
          .eq('Wallet_id', id)
          .order('CreatedDate', { ascending: false })
          .range(from, to);

        console.log('Paginated transactions:', transactions);
        console.log('Transaction error:', error);

        if (!error) {
          setTransactions(transactions || []);

          if (count) {
            setTotalPages(Math.ceil(count / TRANSACTIONS_PER_PAGE));
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setWalletName('Error Loading Wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleIncomeClick = () => {
    if (id) {
      navigate(`/IncomeTx/${id}`);
    } else {
      console.error('No wallet ID found');
      alert('Wallet ID not found. Please try again.');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
      <div className="mt-5 ml-[76px] flex flex-col items-start space-y-2">
        <h1 className="text-[40px] font-bold">
          {walletName || 'Loading Wallet...'}
        </h1>

        {/* Savings Overview */}
        <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
          <div className="text-[28px] font-bold mb-4">Savings Overview</div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <BudgetItem label="Monthly Goal" value={`$${monthlyGoal.toLocaleString()}`} />
              <BudgetItem label="Currently Saved" value={`$${currentSaved.toFixed(2)}`} className="text-green-600" />
              <BudgetItem label="Remaining to Goal" value={`$${remainingToGoal.toFixed(2)}`} className="text-blue-600" />
            </div>
            <div className="space-y-2">
              <BudgetItem
                label="Days Left"
                value={`${daysLeft} days`}
                className={daysLeft <= 3 ? 'text-red-600' : 'text-blue-600'}
              />
              <BudgetItem label="Daily Goal" value={`$${dailyGoal.toFixed(2)}`} className="text-purple-600" />
              <BudgetItem
                label="Progress"
                value={`${monthlyGoal > 0 ? ((currentSaved / monthlyGoal) * 100).toFixed(1) : 0}%`}
              />
            </div>
          </div>
        </div>

        {/* Add Income Button */}
        <div className="w-full max-w-[739px]">
          <Insert onClick={handleIncomeClick} />
        </div>

        {/* Statistics */}
        <div className="bg-white w-[741px] border border-black/25 rounded-[10px] p-6">
          <div className="text-[24px] mb-4">Statistics</div>
          <div className="grid grid-cols-2 gap-5">
            <PieStats walletId={id} />
            <div className="flex flex-col gap-5">
              <SuggestionBox walletId={id} />
              <GoodToKnow walletId={id} />
            </div>
          </div>
          <div className="mt-6">
            <BarGraph walletId={id} />
          </div>
        </div>
      </div>

      {/* Transaction Section */}
      <div className="w-[523px] bg-white mt-14 ml-3 border border-black/25 rounded-[10px] p-6">
        <div className="text-[29px] font-bold mb-4">Transaction History</div>

        {loading && <div className="text-center text-gray-500 py-4">Loading transactions...</div>}

        <div className="max-h-[750px] overflow-y-auto">
          {transactions.length === 0 && !loading ? (
            <div className="text-center text-gray-500 py-4">No transactions found</div>
          ) : (
            transactions.map((transaction, index) => (
              <Transaction
                key={transaction.Tx_id}
                transaction={transaction}
                index={index}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

// Helper component for budget items
function BudgetItem({ label, value, className = "" }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-semibold ${className}`}>{value}</span>
    </div>
  );
}

export default IncomeWalletDetails;