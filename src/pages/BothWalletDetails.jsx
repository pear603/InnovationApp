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
  const [daysLeft, setDaysLeft] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [loading, setLoading] = useState(false);

  const TRANSACTIONS_PER_PAGE = 10;
  const remainingBudget = originalBudget - currentSpent;
  const remainingToGoal = monthlyGoal - currentSaved;
  const currentBalance = (originalBudget - currentSpent) + currentSaved;
  const dailyBudget = daysLeft > 0 ? remainingBudget / daysLeft : 0;
  const dailyGoal = daysLeft > 0 ? remainingToGoal / daysLeft : 0;

  const calculateDaysLeft = (startDate) => {
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + 1);
    return Math.max(0, Math.ceil((end - new Date()) / (1000 * 3600 * 24)));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // Wallet info - get WalletType too!
        const { data: wallet } = await supabase
          .from('Wallet')
          .select('WalletName, StartDate, WalletType')
          .eq('Wallet_id', id)
          .single();

        setWalletName(wallet?.WalletName || 'Wallet Not Found');
        const days = wallet ? calculateDaysLeft(wallet.StartDate) : 0;
        setDaysLeft(days);

        if (wallet?.WalletType === 'Both') {
          // Fetch from BothWallet table for combined wallets
          const { data: bothWallet, error } = await supabase
            .from('BothWallet')
            .select('Budget, Goal')
            .eq('Wallet_id', id)
            .single();

          setOriginalBudget(bothWallet?.Budget || 0);
          setMonthlyGoal(bothWallet?.Goal || 0);
          if (error) {
            console.error('Error fetching data:', error);
          }

        }

        // Get all transactions to calculate totals
        const { data: allTx } = await supabase
          .from('Transaction')
          .select('TxAmount, TxType_id')
          .eq('Wallet_id', id);

        if (allTx) {
          const [{ data: expenseType }, { data: incomeType }] = await Promise.all([
            supabase.from('TxType').select('TxType_id').eq('TxType', 'Expense').single(),
            supabase.from('TxType').select('TxType_id').eq('TxType', 'Income').single()
          ]);

          if (expenseType && incomeType) {
            const totalSpent = allTx
              .filter(tx => tx.TxType_id === expenseType.TxType_id)
              .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);
            const totalSaved = allTx
              .filter(tx => tx.TxType_id === incomeType.TxType_id)
              .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);
            setCurrentSpent(totalSpent);
            setCurrentSaved(totalSaved);
          }
        }

        //Pages for transactions
        const from = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = from + TRANSACTIONS_PER_PAGE - 1;

        const { data: pageTx, count } = await supabase
          .from('Transaction')
          .select(`
            *,
            Tag:Tag_id (Name),
            TxType:TxType_id (TxType)
          `, { count: 'exact' })
          .eq('Wallet_id', id)
          .order('CreatedDate', { ascending: false })
          .range(from, to);

        setTransactions(pageTx || []);
        if (count) setTotalPages(Math.ceil(count / TRANSACTIONS_PER_PAGE));

      } catch (error) {
        console.error('Error fetching data:', error);
        setWalletName('Error Loading Wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  return (
    <div className="w-screen h-screen flex flex-row justify-center bg-[#E2EFF3]">
      <div className="mt-2 ml-[76px] flex flex-col space-y-2">
        <h1 className="text-[40px] font-bold">{walletName || 'Loading...'}</h1>

        {/* Overview */}
        <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
          <div className="text-[28px] font-bold mb-4">Wallet Overview</div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-[20px] font-semibold text-red-600 mb-2">Expense Tracking</div>
              <BudgetItem label="Original Budget" value={`$${originalBudget.toLocaleString()}`} />
              <BudgetItem label="Total Spent" value={`$${currentSpent.toFixed(2)}`} className="text-red-600" />
              <BudgetItem label="Remaining" value={`$${remainingBudget.toFixed(2)}`} className="text-green-600" />
              <BudgetItem label="Daily Budget" value={`$${dailyBudget.toFixed(2)}`} className="text-purple-600" />
            </div>
            <div>
              <div className="text-[20px] font-semibold text-green-600 mb-2">Income Tracking</div>
              <BudgetItem label="Monthly Goal" value={`$${monthlyGoal.toLocaleString()}`} />
              <BudgetItem label="Currently Saved" value={`$${currentSaved.toFixed(2)}`} className="text-green-600" />
              <BudgetItem label="Remaining to Goal" value={`$${remainingToGoal.toFixed(2)}`} className="text-blue-600" />
              <BudgetItem label="Daily Goal" value={`$${dailyGoal.toFixed(2)}`} className="text-purple-600" />
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-[22px] font-bold text-gray-800">Current Balance:</span>
              <span className={`text-[28px] font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${currentBalance.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Days Left: {daysLeft} days</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row w-full max-w-[739px] h-[55px] gap-4 mt-3 mb-5">
          <div className="w-1/2 h-full">
            <Expense onClick={() => navigate(`/ExpenseTx/${id}`)} />
          </div>
          <div className="w-1/2 h-full">
            <Insert onClick={() => navigate(`/IncomeTx/${id}`)} />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white w-[741px] rounded-[10px] p-6 shadow-lg">
          <div className="text-[24px] mb-4">Statistics</div>
          <div className="grid grid-cols-2 gap-5">
            <PieStats walletId={id} />
            <div className="flex flex-col gap-5">
              <SuggestionBox walletId={id} />
              <GoodToKnow walletId={id} />
            </div>
          </div>
          <div className="mt-6"><BarGraph walletId={id} /></div>
        </div>
      </div>

      {/* Transactions */}
      <div className="w-[523px] h-[800px] bg-white mt-14 ml-3 rounded-[10px] p-6">
        <div className="text-[29px] font-bold mb-4">Transaction History</div>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        <div className="max-h-[600px] overflow-y-auto">
          {(!loading && transactions.length === 0)
            ? <p className="text-center text-gray-500">No transactions found</p>
            : transactions.map(tx => <Transaction key={tx.Tx_id} transaction={tx} />)}
        </div>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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

export default BothWalletDetails;