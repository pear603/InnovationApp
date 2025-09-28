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
import BalanceLeft from "../components/BalanceLeft";
import ExpenseButton from "../components/ExpenseBtn";
import Transaction from "../components/Ohma/Transaction";
import { useEffect, useState } from "react";
import { supabase } from '../assets/supabaseClient';

function IncomeWalletDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!id) {
        console.error('No wallet ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data: walletData, error } = await supabase
          .from('Wallet')
          .select('*')
          .eq('Wallet_id', id)
          .single();

        if (error) {
          console.error('Error fetching wallet:', error);
          alert('Error loading wallet data');
          return;
        }

        setWallet(walletData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [id]);

  const handleIncomeClick = () => {
    if (id) {
      navigate(`/IncomeTx/${id}`);
    } else {
      console.error('No wallet ID found');
      alert('Wallet ID not found. Please try again.');
    }
  };

  const handleExpenseClick = () => {
    if (id) {
      navigate(`/ExpenseTx/${id}`);
    } else {
      console.error('No wallet ID found');
      alert('Wallet ID not found. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#E2EFF3]">
        <div>Loading wallet data...</div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#E2EFF3]">
        <div>Wallet not found</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row items-start justify-center bg-[#E2EFF3]">
      <div className="ml-[76px] flex flex-col items-start space-y-2 bg-transparent">
        {/* Wallet Header */}
        <h1 className="text-[32px]">{wallet.WalletName || 'Unnamed Wallet'}</h1>

        {/* Current Balance */}
        <div className="w-[739px] h-[197px]">
          <BalanceLeft walletId={id} />
        </div>

        {/* Action Buttons */}
        <div className="mt-2 flex flex-row w-full max-w-[739px] h-[50px] gap-2">
          <div className="w-full h-full">
            <Insert onClick={handleIncomeClick} />
          </div>
        </div>

        {/* Statistics box */}
        <div className="flex flex-col bg-white w-[741px] h-[691px] border border-black/25 rounded-[10px]">
          <div className="mt-5 ml-10 text-[24px] font-normal">Statistics</div>
          <div className="grid grid-cols-2 w-full h-[291px] mt-4 gap-5">
            <div className="ml-10 mr-8 mb-5">
              <PieStats walletId={id} />
            </div>
            <div className="w-[331px] h-[291px] flex flex-col gap-5">
              <SuggestionBox walletId={id} />
              <GoodToKnow walletId={id} />
            </div>
          </div>
          <div className="w-[635px] h-[230px] ml-10 mt-9">
            <BarGraph walletId={id} />
          </div>
        </div>
      </div>

      {/* Transaction box */}
      <div className="w-[523px] h-[962px] bg-white mt-14 ml-3 border border-black/25 rounded-[10px]">
        <div className="mt-5 ml-10 mb-10 text-[29px] font-normal">Transaction</div>
        <div className="ml-10">
          <Transaction walletId={id} />
        </div>
      </div>
    </div>
  );
}

export default IncomeWalletDetails;