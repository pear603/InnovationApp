import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../assets/supabaseClient";
import Insert from "../components/Ohma/Insert";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import Transaction from "../components/Ohma/Transaction";
import Pagination from "../components/Ohma/Pagination";
import BalanceLeftIncome from "../components/BalanceLeftIncome";
import BalanceLeft from "../components/BalanceLeft";
import PieChart from "../components/Piechart";
import BarChart from "../components/BarChart";
import { AnalyticService } from "../components/AnalyticService";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // <-- for x-axis of bar chart
  LinearScale, // <-- for y-axis of bar chart
  BarElement, // <-- for the bars themselves
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
import "../tailwind.css";

function WalletAnalytic() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [transaction, setTransaction] = useState([]);
  const [balance, setBalance] = useState(0);
  const [count, setCount] = useState(0);
  const [archived, setArchived] = useState(0);
  const [budget, setBudget] = useState(0);
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [walletSummary, setWalletSummary] = useState({
  totalSpent: 0,
  totalSaved: 0,
  avgTx: 0,
});

  const TRANSACTIONS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      try {
        if (user) {
          const transactionData = await AnalyticService.getTransaction(user.id);
          setTransaction(transactionData);

          const balance = AnalyticService.processAllBalance(user.id);
          setBalance(balance);

          const count = AnalyticService.countUserWallets(user.id);
          setCount(count);

          const archived = AnalyticService.archivedWallet(user.id);
          setArchived(archived);

          const budget = await AnalyticService.processBudget(user.id);
          setBudget(budget);

          setTotalPages(
            Math.ceil(transactionData.length / TRANSACTIONS_PER_PAGE)
          );

          // const summary = AnalyticService.processTransactions(transactionData);
          const chartData = AnalyticService.processPieData(transactionData , budget);
          setPieData(chartData);
          const barChartData = AnalyticService.processBarData(transactionData);
          setBarData(barChartData);

          const summary = AnalyticService.processWalletSummary(transactionData);
          setWalletSummary(summary)
          const newSuggestions = [];
          if (summary.totalSpent > summary.totalSaved) {
            newSuggestions.push("Try to reduce your spending next month.");
          } else if (summary.totalSpent < summary.totalSaved) {
            newSuggestions.push("Great job! You're saving more than you spend!");
          } else {
            newSuggestions.push("You’re doing okay! Keep tracking your balance.");
          }

          setSuggestions(newSuggestions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLast = currentPage * TRANSACTIONS_PER_PAGE;
  const indexOfFirst = indexOfLast - TRANSACTIONS_PER_PAGE;
  const currentTransactions = transaction.slice(indexOfFirst, indexOfLast);


  return (
    <div className="w-full min-h-screen flex flex-row items-start justify-center bg-[#E2EFF3] pt-8">
      <div className="flex flex-col bg-transparent gap-4 mx-20 max-w-[1280px] w-full">
        {" "}
        {/*group all*/}
        <h1 className="text-[32px] mt-3">
          {"Wallet Analytics" || "Loading..."}
        </h1>
        <div className="flex flex-col 2xl:flex-row gap-4 ">
          {" "}
          {/*group left right area*/}
          <div className="gap-4 flex flex-col flex-1">
            {/*group left*/}

            {/* Stats */}
            <div className="gap-[10px] flex flex-col ">
              
              <div className="w-full flex justify-center flex-1 ">
                <div className="w-full lg:w-[739px] flex-1 h-min-[197px]">
                  <BalanceLeft variant={"Analytic"} balance={balance} walletNum={count} archived={archived}/>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white w-full h-auto border border-black/25 rounded-[10px] gap-4 justify-items-center pl-10 pr-10 pt-6 pb-6">
              
              <div className=" text-[24px] font-normal">Statistics</div>

              
              <div className="flex flex-col sm:flex-row md:flex-row gap-5 flex-warp">
                <div className="w-full md:w-1/2 h-[291px] flex-1">
                  <div className="flex flex-col items-center justify-center w-full h-[291px] box-content  rounded-[9px] bg-gray-100 border border-black/10">
                    <PieChart data={pieData} />
                  </div>

                  {/* <PieChart/> */}
                </div>

                <div className="w-full md:w-1/2 flex flex-1 flex-col sm:flex-col md:flex-col lg:flex-col gap-4 ">
                  <GoodToKnow sum = {walletSummary} variant="Analytic"/>
                  <SuggestionBox msg = {suggestions} variant="Analytic" />
                </div>
              </div>

              <div className="w-full h-[230px] justify-items-center box-content  rounded-[9px] bg-gray-100 border border-black/10">
                <BarChart data={barData} />
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
              {!loading && currentTransactions.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions found
                </p>
              ) : (
                currentTransactions.map((tx) => (
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

export default WalletAnalytic;
