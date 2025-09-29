import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import "../tailwind.css";
import Expense from "../components/Ohma/Expense";
import Transaction from "../components/Ohma/Transaction";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '../assets/supabaseClient';
import { useEffect, useState } from "react";
import Pagination from "../components/Ohma/Pagination";

function ExpenseWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [originalBudget, setOriginalBudget] = useState(0);
  const [currentSpent, setCurrentSpent] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  const TRANSACTIONS_PER_PAGE = 10;

  const remainingBudget = originalBudget - currentSpent;
  const dailyBudget = daysLeft > 0 ? remainingBudget / daysLeft : 0;

  const calculateDaysLeft = (startDate) => {
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + 1);
    const today = new Date();
    const daysLeft = Math.ceil((end - today) / (1000 * 3600 * 24));
    return Math.max(0, daysLeft);
  };

  const fetchTotalSpent = async (walletId) => {
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

      if (expenseType) {
        const totalSpent = allTransactions
          .filter(tx => tx.TxType_id === expenseType.TxType_id)
          .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);

        setCurrentSpent(totalSpent);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Get wallet info - ADD ERROR HANDLING
        const { data: wallet, error: walletError } = await supabase
          .from('Wallet')
          .select('WalletName, StartDate, DailyAvaliable')
          .eq('Wallet_id', id)
          .single();

        console.log('Wallet data:', wallet); // Debug
        console.log('Wallet error:', walletError); // Debug

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

        // Get original budget
        const { data: expenseWallet, error: budgetError } = await supabase
          .from('ExpenseWallet')
          .select('Budget')
          .eq('Wallet_id', id)
          .single();

        console.log('ExpenseWallet data:', expenseWallet); // Debug
        console.log('Budget error:', budgetError); // Debug

        if (expenseWallet) {
          setOriginalBudget(expenseWallet.Budget || 0);
        } else {
          setOriginalBudget(0);
        }

        // Fetch total spent
        await fetchTotalSpent(id);

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

  const handleExpenseClick = () => {
    if (id) {
      navigate(`/ExpenseTx/${id}`);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
      <div className="mt-5 ml-[76px] flex flex-col items-start space-y-2">
        {/* Wallet Name - Fixed with better fallback */}
        <h1 className="text-[40px] font-bold">
          {walletName || 'Loading Wallet...'}
        </h1>

        <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
          <div className="text-[28px] font-bold mb-4">Budget Overview</div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <BudgetItem label="Original Budget" value={`$${originalBudget.toLocaleString()}`} />
              <BudgetItem label="Total Spent" value={`$${currentSpent.toFixed(2)}`} className="text-red-600" />
              <BudgetItem label="Remaining" value={`$${remainingBudget.toFixed(2)}`} className="text-green-600" />
            </div>
            <div className="space-y-2">
              <BudgetItem
                label="Days Left"
                value={`${daysLeft} days`}
                className={daysLeft <= 3 ? 'text-red-600' : 'text-blue-600'}
              />
              <BudgetItem label="Daily Budget" value={`$${dailyBudget.toFixed(2)}`} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[800px]">
          <Expense onClick={handleExpenseClick} />
        </div>

        <div className="bg-white w-[741px] border border-black/25 rounded-[10px] p-6">
          <div className="text-[24px] mb-4">Statistics</div>
          <div className="grid grid-cols-2 gap-5">
            <PieStats />
            <div className="flex flex-col gap-5">
              <SuggestionBox />
              <GoodToKnow />
            </div>
          </div>
          <div className="mt-6">
            <BarGraph />
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

function BudgetItem({ label, value, className = "" }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-semibold ${className}`}>{value}</span>
    </div>
  );
}

export default ExpenseWalletDetails;