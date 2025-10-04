import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TransactionService } from "../components/TransactionService";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import "../tailwind.css";
import ExpenseBtn from "../components/ExpenseBtn";
import Insert from "../components/Ohma/Insert";
import Transaction from "../components/Ohma/Transaction";
import BalanceLeft from "../components/BalanceLeft";
import Pagination from "../components/Ohma/Pagination";

function BothWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [walletInfo, setWalletInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TRANSACTIONS_PER_PAGE = 10;

  useEffect(() => {
    const fetchWallet = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const info = await TransactionService.getWalletInfo(id, "both");
        setWalletInfo(info);

        const from = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = from + TRANSACTIONS_PER_PAGE - 1;
        const { data, count } = await TransactionService.getTransactions(id, from, to);

        setTransactions(data);
        setTotalPages(Math.ceil(count / TRANSACTIONS_PER_PAGE));
      } catch (err) {
        console.error(err);
        setWalletInfo({ walletName: "Error Loading Wallet" });
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [id, currentPage]);

  if (!walletInfo) return <p className="text-center mt-10">Loading...</p>;

  const {
    walletName,
    originalBudget: monthlyBudget = 0,
    currentSpent = 0,
    currentSaved = 0,
    daysLeft = 0,
    monthlyGoal = 0,
    dailyBudget = 0,
    dailyGoal = 0,
  } = walletInfo;

  const remainingBudget = monthlyBudget - currentSpent;
  const remainingToGoal = monthlyGoal - currentSaved;
  const currentBalance = monthlyBudget - currentSpent + currentSaved;

  return (
    <div className="w-full min-h-screen flex flex-row items-start justify-center bg-[#E2EFF3] pt-8">
      <div className="flex flex-col bg-transparent gap-4 mx-20 max-w-[1280px] w-full">
        {" "}
        {/*group all*/}
        <h1 className="text-[32px] mt-3">{walletName || "Loading..."}</h1>
        <div className="flex flex-col 2xl:flex-row gap-4 ">
          {" "}
          {/*group left right area*/}
          <div className="gap-4 flex flex-col flex-1">
            {/*group left*/}

            {/* Overview */}
            {/* <div className="w-[739px] bg-white rounded-[10px] p-6 shadow-lg">
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
        </div> */}
            <div className="w-full gap-[10px] flex flex-col ">
              <div className="w-full flex justify-center flex-1 ">
              <div className="w-full lg:w-[739px] flex-1 h-min-[197px]">
                <BalanceLeft
                  balance={currentBalance}
                  day={daysLeft}
                  dailygoal={dailyGoal}
                  dailybudget = {dailyBudget}
                  variant="Both"
                  goal={monthlyGoal}
                  budget={monthlyBudget}
                />
              </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-2 flex flex-row w-full h-[50px]">
                <div className=" grid grid-cols-2 w-full h-full gap-2">
                  <Insert onClick={() => navigate(`/IncomeTx/${id}`)} />
                  <ExpenseBtn onClick={() => navigate(`/ExpenseTx/${id}`)} />
                </div>
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
                  <GoodToKnow totalspent ={currentSpent} remainbudget={remainingBudget} totalsave= {currentSaved} remaingoal={remainingToGoal} variant="Both"/>
                  <SuggestionBox walletId={id} />
                </div>
              </div>

              <div className="w-full h-[230px] justify-items-center">
                <BarGraph walletId={id} />
              </div>
            </div>
          </div>
          {/* Transactions */}
          <div className="flex-1 w-full bg-white border border-black/25 rounded-lg p-4">
            <div className="mt-5 ml-10 mb-10 text-2xl font-normal">
              Transaction History
            </div>
            {loading && (
              <p className="text-center text-gray-500 ">Loading...</p>
            )}
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

function BudgetItem({ label, value, className = "" }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-semibold ${className}`}>{value}</span>
    </div>
  );
}

export default BothWalletDetails;
