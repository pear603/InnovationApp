import "../tailwind.css";
import WalletIcon from "../components/WalletIcon";
import { useEffect, useState } from "react";
import { supabase } from "../assets/supabaseClient";
import { useParams } from "react-router-dom";

function BalanceLeft({
  day,
  balance,
  daily,
  variant,
  goal,
  budget,
  dailygoal,
  dailybudget,
}) {
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
        setDailyAvaliable(data.DailyAvaliable?.trim()); // "On/Off"
        setWalletIcon(data.WalletIcon);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="w-full  bg-white rounded-lg flex flex-row items-start px-4 py-4 border border-black/25 gap-6">
      <WalletIcon image={walletIcon} />

      <div className="flex-1 flex flex-col pt-3 gap-3">
        <p className="text-2xl sm:text-3xl md:text-4xl pb-4">
          Balance: {balance} ฿
        </p>
        <div className="flex flex-col">
          {dailyAvaliable === "On" && (
            <>
              {variant === "Income" && (
                <>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C] underline">
                    {day} Day left for goal: {goal} ฿
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
                    Daily saving required to reach goal: {daily} ฿
                  </p>
                </>
              )}

              {variant === "Expenxe" && (
                <>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C] underline">
                    {day} Day left for Budget: {budget} ฿
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
                    Daily spending allowed: {daily} ฿
                  </p>
                </>
              )}
              
              {variant === "Both" && (
                <>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C] underline">
                    {day} Day left for Budget: {budget} ฿ and Goal: {goal} ฿
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
                    Daily saving required to reach goal: {dailygoal} ฿
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
                    Daily spending allowed: {dailybudget} ฿
                  </p>
                </>
              )}
            </>
          )}
          {dailyAvaliable !== "On" && (
            <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
              Daily balance tracking is off
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BalanceLeft;
