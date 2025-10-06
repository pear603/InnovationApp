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
import { Bar }from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,  // <-- for x-axis of bar chart
  LinearScale,    // <-- for y-axis of bar chart
  BarElement      // <-- for the bars themselves
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
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [transaction, setTransaction] = useState([]);
  const [pieData, setPieData] = useState(null);
    const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(true);
   const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const transactionData = await AnalyticService.getTransaction(user.id);
        setTransaction(transactionData);

        const summary = AnalyticService.processTransactions(transactionData);
        const chartData = {
          labels: Object.keys(summary), // e.g. ["Expense", "Income"]
          datasets: [
            {
              data: Object.values(summary).map((tags) =>
                Object.values(tags).reduce((a, b) => a + b, 0)
              ),
              backgroundColor: ["#E16451", "#9AD24B"], // colors
            },
          ],
        };

        setPieData(chartData);

        
        const barChartData = AnalyticService.processBarData(transactionData);

        setBarData(barChartData);

      }
    };

    fetchData();
  }, []);

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
            <div className="flex flex-col bg-white w-full h-auto border border-black/25 rounded-[10px] gap-4 justify-items-center pl-10 pr-10 pt-6 pb-6">
              <div className=" text-[24px] font-normal">Statistics</div>

              <div className="flex flex-col sm:flex-row md:flex-row gap-5">
                <div className="w-full md:w-1/2 h-[291px]">
                  <PieStats>
                    <div>
                      <PieChart data={pieData} />
                    </div>
                  </PieStats>

                  {/* <PieChart/> */}
                </div>

                <div className="w-full md:w-1/2 flex flex-col sm:flex-col md:flex-col lg:flex-col gap-4 ">
                  <GoodToKnow />
                  <SuggestionBox walletId={id} />
                </div>
              </div>

              <div className="w-full h-[230px] justify-items-center">
                <BarChart data={barData} />
              </div>
            </div>

            <div className="gap-[10px] flex flex-col ">
              <div className="w-full flex justify-center flex-1 ">
                <div className="w-full lg:w-[739px] flex-1 h-min-[197px]">
                  <BalanceLeft />
                </div>
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
              {!loading && transaction.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions found
                </p>
              ) : (
                transaction.map((tx) => (
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
