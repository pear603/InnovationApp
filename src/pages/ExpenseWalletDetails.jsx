import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../assets/supabaseClient";
import ExpenseBtn from "../components/ExpenseBtn";
import Transaction from "../components/Ohma/Transaction";
import Pagination from "../components/Ohma/Pagination";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import "../tailwind.css";
import BalanceLeftIncome from "../components/BalanceLeftIncome";
import BalanceLeft from "../components/BalanceLeft";

function ExpenseWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [walletName, setWalletName] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TRANSACTIONS_PER_PAGE = 10;
  const remainingBudget = (monthlyBudget - totalSpent);
  const currentBalance = monthlyBudget - totalSpent; // For expense wallet, balance = total spent

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
          .from("Wallet")
          .select("WalletName, StartDate")
          .eq("Wallet_id", id)
          .single();

        setWalletName(wallet?.WalletName || "Wallet Not Found");
        const days = wallet ? calculateDaysLeft(wallet.StartDate) : 0;
        setDaysLeft(days);

        // Monthly budget
        const { data: expenseWallet } = await supabase
          .from("ExpenseWallet")
          .select("Budget")
          .eq("Wallet_id", id)
          .single();
        setMonthlyBudget(expenseWallet?.Budget || 0);

        // Transactions
        const { data: allTx } = await supabase
          .from("Transaction")
          .select("TxAmount, TxType_id")
          .eq("Wallet_id", id);

        const { data: expenseType } = await supabase
          .from("TxType")
          .select("TxType_id")
          .eq("TxType", "Expense")
          .single();

        if (expenseType && allTx) {
          const total = allTx
            .filter((tx) => tx.TxType_id === expenseType.TxType_id)
            .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0);
          setTotalSpent(total);
        }

        // Paginated transactions
        const from = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = from + TRANSACTIONS_PER_PAGE - 1;

        const { data: pageTx, count } = await supabase
          .from("Transaction")
          .select(
            `
            *,
            Tag:Tag_id (Name),
            TxType:TxType_id (TxType)
          `,
            { count: "exact" }
          )
          .eq("Wallet_id", id)
          .order("CreatedDate", { ascending: false })
          .range(from, to);

        setTransactions(pageTx || []);
        if (count) setTotalPages(Math.ceil(count / TRANSACTIONS_PER_PAGE));

        // Daily limit
        setDailyLimit(days > 0 ? Math.floor((monthlyBudget - totalSpent) / days) : 0);
      } catch {
        setWalletName("Error Loading Wallet");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage, monthlyBudget, totalSpent]);

  return (
    <div className="w-full min-h-screen flex flex-row items-start justify-center bg-[#E2EFF3] pt-8">
      <div className="flex flex-col bg-transparent gap-4 mx-20 max-w-[1280px] w-full">

        {/*group all*/}
        <h1 className="text-[32px] mt-3">{walletName || "Loading..."}</h1>
        <div className="flex flex-col 2xl:flex-row gap-4 ">

          {/*group left right area*/}
          <div className="gap-4 flex flex-col flex-1">
            {/*group left*/}

            {/* Overview */}
            {/* <Overview
          monthlyBudget={monthlyBudget}
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
          daysLeft={daysLeft}
          dailyLimit={dailyLimit}
          currentBalance={currentBalance}
        /> */}

            <div className="gap-[10px] flex flex-col">
              <div className="w-full flex justify-center flex-1 ">
              <div className="w-full lg:w-[739px] flex-1 h-min-[197px]">
                <BalanceLeft
                  balance={currentBalance}
                  day={daysLeft}
                  daily={dailyLimit}
                  variant={"Expenxe"}
                  budget = {monthlyBudget}
                />
              </div>
              </div>

              <div className="mt-2 flex flex-row w-full h-[50px]">
                <ExpenseBtn onClick={() => navigate(`/ExpenseTx/${id}`)} />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col bg-white w-full h-auto border border-black/25 rounded-[10px] gap-4 justify-items-center pl-10 pr-10 pt-6 pb-6">
              <div className=" text-[24px] font-normal">Statistics</div>

              <div className="flex flex-col sm:flex-row md:flex-row gap-5">
                <div className="w-full md:w-1/2 h-[291px]">
                  <PieStats />
                </div>

                <div className="w-full md:w-1/2 flex flex-col sm:flex-col md:flex-col lg:flex-col gap-4 ">
                  <GoodToKnow totalspent={totalSpent} remainbudget={remainingBudget} variant="Expense" />
                  <SuggestionBox walletId={id} />
                </div>
              </div>

              <div className="w-full h-[230px] justify-items-center">
                <BarGraph walletId={id} />
              </div>
            </div>
          </div>

          {/* Fixed Transaction Area */}
          <div className="flex-1 w-full bg-white border border-black/25 rounded-lg p-4">
            <div className="mt-5 ml-10 mb-10 text-2xl font-normal">
              Transaction History
            </div>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            <div className="m-10">
              {!loading && transactions.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions found
                </p>
              ) : (
                transactions.map((tx) => (
                  <Transaction key={tx.Tx_id} transaction={tx} />
                ))
              )}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview({
  monthlyBudget,
  totalSpent,
  remainingBudget,
  daysLeft,
  dailyLimit,
  currentBalance,
}) {
  return (
    <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
      <div className="text-[28px] font-bold mb-4">Budget Overview</div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <BudgetItem
            label="Monthly Budget"
            value={`$${monthlyBudget.toLocaleString()}`}
          />
          <BudgetItem
            label="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            className="text-red-600"
          />
          <BudgetItem
            label="Remaining Budget"
            value={`$${remainingBudget.toFixed(2)}`}
            className="text-green-600"
          />
        </div>
        <div>
          <BudgetItem
            label="Days Left"
            value={`${daysLeft} days`}
            className={daysLeft <= 3 ? "text-red-600" : "text-blue-600"}
          />
          <BudgetItem
            label="Daily Limit"
            value={`$${dailyLimit.toFixed(2)}`}
            className="text-purple-600"
          />
          <BudgetItem
            label="Progress"
            value={`${
              monthlyBudget > 0
                ? ((totalSpent / monthlyBudget) * 100).toFixed(1)
                : 0
            }%`}
          />
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-[22px] font-bold text-gray-800">
            Current Balance:
          </span>
          <span className="text-[28px] font-bold text-black-600">
            ${currentBalance.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Days Left: {daysLeft} days
        </div>
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
