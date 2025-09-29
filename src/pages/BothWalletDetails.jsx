import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import "../tailwind.css";
import Expense from "../components/Ohma/Expense";
import Insert from "../components/Ohma/Insert";
import Transaction from "../components/Ohma/Transaction";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';
import { useEffect, useState } from "react";
import Pagination from "../components/Ohma/Pagination";

function BothWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [originalBudget, setOriginalBudget] = useState(0);
  const [currentSpent, setCurrentSpent] = useState(0);
  const [currentSaved, setCurrentSaved] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [loading, setLoading] = useState(false);

  const TRANSACTIONS_PER_PAGE = 10;

  const remainingBudget = originalBudget - currentSpent;
  const remainingToGoal = monthlyGoal - currentSaved;

  const calculateDaysLeft = (startDate) => {
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + 1);
    const today = new Date();
    const daysLeft = Math.ceil((end - today) / (1000 * 3600 * 24));
    return Math.max(0, daysLeft);
  };

  const fetchTransactionData = async (walletId) => {
    const { data: allTransactions, error } = await supabase
      .from('Transaction')
      .select('TxAmount, TxType_id')
      .eq('Wallet_id', walletId);

    if (allTransactions && !error) {
      const { data: expenseType } = await supabase
        .from('TxType')
        .select('TxType_id')
        .eq('TxType', 'Expense')
        .single();

      const { data: incomeType } = await supabase
        .from('TxType')
        .select('TxType_id')
        .eq('TxType', 'Income')
        .single();

      if (expenseType && incomeType) {
        const totalSpent = allTransactions
          .filter(tx => tx.TxType_id === expenseType.TxType_id)
          .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);

        const totalSaved = allTransactions
          .filter(tx => tx.TxType_id === incomeType.TxType_id)
          .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);

        setCurrentSpent(totalSpent);
        setCurrentSaved(totalSaved);

        const balance = (originalBudget - totalSpent) + totalSaved;
        setCurrentBalance(balance);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data: wallet, error: walletError } = await supabase
          .from('Wallet')
          .select('WalletName, StartDate, DailyAvaliable')
          .eq('Wallet_id', id)
          .single();

        if (walletError) {
          console.error('Error fetching wallet:', walletError);
          setWalletName('Wallet Not Found');
        } else if (wallet) {
          setWalletName(wallet.WalletName || 'Unnamed Wallet');
          const days = calculateDaysLeft(wallet.StartDate);
          setDaysLeft(days);
        } else {
          setWalletName('Wallet Not Found');
        }

        const { data: expenseWallet, error: budgetError } = await supabase
          .from('ExpenseWallet')
          .select('Budget')
          .eq('Wallet_id', id)
          .single();

        if (expenseWallet) {
          setOriginalBudget(expenseWallet.Budget || 0);
        } else {
          setOriginalBudget(0);
        }

        const { data: incomeWallet, error: goalError } = await supabase
          .from('IncomeWallet')
          .select('Goal')
          .eq('Wallet_id', id)
          .single();

        if (incomeWallet) {
          setMonthlyGoal(incomeWallet.Goal || 0);
        } else {
          setMonthlyGoal(0);
        }

        await fetchTransactionData(id);

        const dailyBudget = daysLeft > 0 ? remainingBudget / daysLeft : 0;
        const dailyGoal = daysLeft > 0 ? (monthlyGoal - currentSaved) / daysLeft : 0;
        setDailyBudget(dailyBudget);
        setDailyGoal(dailyGoal);

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

  const handleExpenseClick = () => {
    if (id) {
      navigate(`/ExpenseTx/${id}`);
    }
  };

  const handleIncomeClick = () => {
    if (id) {
      navigate(`/IncomeTx/${id}`);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
      <div className="mt-2 ml-[76px] flex flex-col items-start space-y-2">
        <h1 className="text-[40px] font-bold">
          {walletName || 'Loading Wallet...'}
        </h1>

        {/* Combined Budget Overview */}
        <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
          <div className="text-[28px] font-bold mb-4">Wallet Overview</div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Expense Section */}
            <div className="space-y-2">
              <div className="text-[20px] font-semibold text-red-600 mb-2">Expense Tracking</div>
              <BudgetItem label="Original Budget" value={`$${originalBudget.toLocaleString()}`} />
              <BudgetItem label="Total Spent" value={`$${currentSpent.toFixed(2)}`} className="text-red-600" />
              <BudgetItem label="Remaining" value={`$${remainingBudget.toFixed(2)}`} className="text-green-600" />
              <BudgetItem label="Daily Budget" value={`$${dailyBudget.toFixed(2)}`} className="text-purple-600" />
            </div>

            {/* Income Section */}
            <div className="space-y-2">
              <div className="text-[20px] font-semibold text-green-600 mb-2">Income Tracking</div>
              <BudgetItem label="Monthly Goal" value={`$${monthlyGoal.toLocaleString()}`} />
              <BudgetItem label="Currently Saved" value={`$${currentSaved.toFixed(2)}`} className="text-green-600" />
              <BudgetItem label="Remaining to Goal" value={`$${remainingToGoal.toFixed(2)}`} className="text-blue-600" />
              <BudgetItem label="Daily Goal" value={`$${dailyGoal.toFixed(2)}`} className="text-purple-600" />
            </div>
          </div>

          {/* Current Balance - Combined */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-[22px] font-bold text-gray-800">Current Balance:</span>
              <span className={`text-[28px] font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${currentBalance.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Days Left: {daysLeft} days
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex flex-row w-full max-w-[739px] h-[60px] gap-4">
          <div className="w-1/2 h-full">
            <Expense onClick={handleExpenseClick} />
          </div>
          <div className="w-1/2 h-full">
            <Insert onClick={handleIncomeClick} />
          </div>
        </div>

        {/* Smaller Statistics Section */}
        <div className="bg-white w-[741px] border border-black/25 rounded-[10px] p-4">
          <div className="text-[20px] font-semibold mb-3">Statistics</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[200px]">
              <PieStats walletId={id} />
            </div>
            <div className="flex flex-col gap-3 h-[200px]">
              <div className="h-[90px]">
                <SuggestionBox walletId={id} />
              </div>
              <div className="h-[90px]">
                <GoodToKnow walletId={id} />
              </div>
            </div>
          </div>
          <div className="mt-4 h-[180px]">
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

export default BothWalletDetails;