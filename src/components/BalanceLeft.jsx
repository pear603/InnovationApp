import "../tailwind.css";
import WalletIcon from "../components/WalletIcon";
import { useEffect, useState } from "react";
import { supabase } from "../assets/supabaseClient";
import { useParams } from "react-router-dom";

function BalanceLeft() {
  const { id } = useParams(); 
  const [dailyAvaliable, setDailyAvaliable] = useState(null);
  const [walletIcon, setWalletIcon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("Wallet")
        .select("DailyAvaliable, WalletIcon")
        .eq("Wallet_id", id)
        .single();

      if (error) {
        console.log("Error fetching DailyAvaliable:", error);
      } else if (data) {
        setDailyAvaliable(data.DailyAvaliable?.trim());// "On/Off"
        setWalletIcon(data.WalletIcon); 
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="w-full bg-white rounded-lg flex flex-row items-start px-4 py-4 gap-9 border border-black/25">
      <WalletIcon image={walletIcon} />

      <div className="flex-1 flex flex-col">
        <p className="text-2xl sm:text-3xl md:text-4xl pb-4">
          Balance 1681 ฿
        </p>

        {dailyAvaliable === "On" && (
          <>
            <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C] underline pb-2">
              14 Day Left
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
              Daily balance 120 ฿
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default BalanceLeft;
