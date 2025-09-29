import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../assets/supabaseClient';
import Insert from "../components/Ohma/Insert";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import Transaction from "../components/Ohma/Transaction";
import Pagination from "../components/Ohma/Pagination";
import "../tailwind.css";

function IncomeWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [walletName, setWalletName] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [currentSaved, setCurrentSaved] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TRANSACTIONS_PER_PAGE = 10;
  const remainingToGoal = monthlyGoal - currentSaved;
  const currentBalance = currentSaved; // For income wallet, balance = current saved

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
        // Wallet info
        const { data: wallet } = await supabase
          .from('Wallet')
          .select('WalletName, StartDate')
          .eq('Wallet_id', id)
          .single();

        setWalletName(wallet?.WalletName || 'Wallet Not Found');
        const days = wallet ? calculateDaysLeft(wallet.StartDate) : 0;
        setDaysLeft(days);

        // Monthly goal
        const { data: incomeWallet } = await supabase
          .from('IncomeWallet')
          .select('Goal')
          .eq('Wallet_id', id)
          .single();
        setMonthlyGoal(incomeWallet?.Goal || 0);

        // Transactions (all, to calculate total saved)
        const { data: allTx } = await supabase
          .from('Transaction')
          .select('TxAmount, TxType_id')
          .eq('Wallet_id', id);

        const { data: incomeType } = await supabase
          .from('TxType')
          .select('TxType_id')
          .eq('TxType', 'Income')
          .single();

        if (incomeType && allTx) {
          const total = allTx
            .filter(tx => tx.TxType_id === incomeType.TxType_id)
            .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);
          setCurrentSaved(total);
        }

        // Paginated transactions
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

        // Daily goal (after currentSaved fetched)
        setDailyGoal(days > 0 ? (monthlyGoal - currentSaved) / days : 0);

      } catch (err) {
        setWalletName('Error Loading Wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage, monthlyGoal, currentSaved]);

  return (
    <div className="w-screen h-screen flex flex-row justify-center bg-[#E2EFF3]">
      <div className="mt-5 ml-[76px] flex flex-col space-y-2">
        <h1 className="text-[40px] font-bold">{walletName || 'Loading...'}</h1>

        {/* Overview */}
        <Overview
          monthlyGoal={monthlyGoal}
          currentSaved={currentSaved}
          remainingToGoal={remainingToGoal}
          daysLeft={daysLeft}
          dailyGoal={dailyGoal}
          currentBalance={currentBalance}
        />

        {/* Add Income */}
        <div className="h-[55px] mt-3 mb-5">
          <Insert onClick={() => navigate(`/IncomeTx/${id}`)} />
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

      {/* Fixed Transaction Area */}
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

function Overview({ monthlyGoal, currentSaved, remainingToGoal, daysLeft, dailyGoal, currentBalance }) {
  return (
    <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
      <div className="text-[28px] font-bold mb-4">Savings Overview</div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <BudgetItem label="Monthly Goal" value={`$${monthlyGoal.toLocaleString()}`} />
          <BudgetItem label="Currently Saved" value={`$${currentSaved.toFixed(2)}`} className="text-green-600" />
          <BudgetItem label="Remaining to Goal" value={`$${remainingToGoal.toFixed(2)}`} className="text-blue-600" />
        </div>
        <div>
          <BudgetItem label="Days Left" value={`${daysLeft} days`} className={daysLeft <= 3 ? 'text-red-600' : 'text-blue-600'} />
          <BudgetItem label="Daily Goal" value={`$${dailyGoal.toFixed(2)}`} className="text-purple-600" />
          <BudgetItem label="Progress" value={`${monthlyGoal > 0 ? ((currentSaved / monthlyGoal) * 100).toFixed(1) : 0}%`} />
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-[22px] font-bold text-gray-800">Current Balance:</span>
          <span className="text-[28px] font-bold text-green-600">
            ${currentBalance.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">Days Left: {daysLeft} days</div>
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

export default IncomeWalletDetails;