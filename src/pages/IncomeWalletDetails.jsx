import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TransactionService } from "../components/TransactionService";
import Insert from "../components/Ohma/Insert";
import PieStats from "../components/Ohma/PieStats";
import BarGraph from "../components/Ohma/BarGraph";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import SuggestionBox from "../components/Ohma/SuggestionBox";
import Transaction from "../components/Ohma/Transaction";
import Pagination from "../components/Ohma/Pagination";
import BalanceLeft from "../components/BalanceLeft";
import { AnalyticService } from "../components/AnalyticService";
import "../tailwind.css";
import PieChart from "../components/Piechart";
import BarChart from "../components/BarChart";
import ProgressChart from "../components/ProgressChart";
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

function IncomeWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [walletInfo, setWalletInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barData, setBarData] = useState(null);
  const [progressData, setProgressData] =useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TRANSACTIONS_PER_PAGE = 10;

  // Fetch wallet info
  useEffect(() => {
    const fetchWallet = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const info = await TransactionService.validateWalletType(id, "income");
        setWalletInfo(info);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [id]);

  // Fetch paginated transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!id || !walletInfo) return;
      setLoading(true);
      try {
        const from = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = from + TRANSACTIONS_PER_PAGE - 1;
        const { data, count } = await TransactionService.getTransactions(
          id,
          from,
          to
        );
        setTransactions(data);
        setTotalPages(Math.ceil(count / TRANSACTIONS_PER_PAGE));

        const chartData = AnalyticService.processPieData(data);
        setPieData(chartData);

        const barChartData = AnalyticService.processBarData(data);
        setBarData(barChartData);
        
        const progress = AnalyticService.processIncomeProgress(walletInfo, data);
        setProgressData(progress);
  
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [id, currentPage, walletInfo]);

  if (loading || !walletInfo)
    return <p className="text-center mt-10">Loading...</p>;

  const {
    walletName,
    monthlyGoal = 0,
    currentSaved = 0,
    daysLeft = 0,
    dailyGoal = 0,
  } = walletInfo;

  const remainingToGoal = monthlyGoal - currentSaved;
  const currentBalance = currentSaved;

  if (!walletName) return <p className="text-center mt-10">Loading...</p>;

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
            {/* <Overview
          monthlyGoal={monthlyGoal}
          currentSaved={currentSaved}
          remainingToGoal={remainingToGoal}
          daysLeft={daysLeft}
          dailyGoal={dailyGoal}
          currentBalance={currentBalance}
        /> */}

            <div className="gap-[10px] flex flex-col ">
              <div className="w-full flex justify-center flex-1 ">
                <div className="w-full lg:w-[739px] flex-1 h-min-[197px]">
                  <BalanceLeft
                    balance={currentBalance}
                    day={daysLeft}
                    daily={dailyGoal}
                    goal={monthlyGoal}
                    variant={"Income"}
                  />
                </div>
              </div>

              {/* Income Buttons */}
              <div className="mt-2 flex flex-row w-full h-[50px]">
                <Insert onClick={() => navigate(`/IncomeTx/${id}`)} />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col bg-white w-full h-auto border border-black/25 rounded-[10px] gap-4 justify-items-center pl-10 pr-10 pt-6 pb-6">
              <div className=" text-[24px] font-normal">Statistics</div>

              <div className="flex flex-col sm:flex-row md:flex-row gap-5">
                <div className="w-full md:w-1/2 h-[291px]">
                  <div className="flex flex-col items-center justify-center w-full h-[291px] box-content  rounded-[9px] bg-gray-100 border border-black/10">
                    {/* <PieChart data={pieData} /> */}
                    <ProgressChart progressData={progressData} />
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col sm:flex-col md:flex-col lg:flex-col gap-4 ">
                  <GoodToKnow
                    totalsave={currentSaved}
                    remaingoal={remainingToGoal}
                    variant="Income"
                  />
                  <SuggestionBox walletId={id} />
                </div>
              </div>

              <div className="w-full h-[230px] justify-items-center">
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



export default IncomeWalletDetails;
