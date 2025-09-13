// src/pages/AddWallet.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; //  navigate
import { supabase } from "../assets/supabaseClient";
import WalletIcon from "../components/WalletIcon";
import WalletName from "../components/WalletName";
import FinancePanel from "../components/FinancePanel";
import "../tailwind.css";

function AddWallet() {
  const navigate = useNavigate(); // navigate
  const [walletData, setWalletData] = useState({
    name: "",
    iconUrl: null,   // preview URL
    iconFile: null,  // actual File object
    type: "Expense",
    budget: "",
    goal: "",
    showDailyBudget: false,
    showDailyGoal: false
  });

  const handleCreateWallet = async () => {
    let iconUrl = null;

    if (walletData.iconFile) {
      const fileName = `${Date.now()}_wallet.png`;
      const { error: uploadError } = await supabase.storage
        .from("WalletIcon")
        .upload(fileName, walletData.iconFile);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("WalletIcon")
          .getPublicUrl(fileName);
        iconUrl = data.publicUrl;
      } else {
        console.error("Upload error:", uploadError);
      }
    }

    const now = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" });


    // Insert to Supabase
    const { error } = await supabase.from("Wallets").insert([{
      name: walletData.name || "Unnamed Wallet",
      icon: iconUrl,
      type: walletData.type,
      budget: walletData.budget ? Number(walletData.budget) : 0,
      goal: walletData.goal ? Number(walletData.goal) : 0,
      show_daily_budget: walletData.showDailyBudget ?? false,
      show_daily_goal: walletData.showDailyGoal ?? false,
      startdate: now
    }]);

    if (error) {
      console.error("Supabase insert error:", error);
      alert(`Failed to create wallet: ${error.message}`);
    } else {
      alert("Wallet created successfully!");

      // reset 
      setWalletData({
        name: "",
        iconUrl: null,
        iconFile: null,
        type: "Expense",
        budget: "",
        goal: "",
        showDailyBudget: false,
        showDailyGoal: false
      });

      // link to /walletlist
      navigate("/walletlist");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <p className="text-2xl sm:text-[32px] ml-4 sm:ml-12 mt-4 sm:mt-6">Wallets</p>

      <div className="w-full sm:w-[1273px] h-auto sm:h-[915px] pt-6 sm:pt-[60px] mx-auto">
        <div className="flex justify-center items-center pt-6 sm:pt-[60px]">
          <div className="w-[90%] sm:w-[632px] h-auto sm:h-[424px] bg-white rounded-lg border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)]">

            {/* Close Button */}
            <div className="w-full h-[40px] bg-white rounded-lg border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)] relative">
              <div className="w-[25px] h-[25px] bg-white border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200">
                ✖
              </div>
            </div>

            {/* Wallet Icon + Name */}
            <div className="w-full h-auto sm:h-[344px] mt-5 sm:mt-[20px] flex flex-col items-center bg-transparent">
              <div className="w-full sm:w-[631px] h-auto sm:h-[173px] px-4 sm:px-[40px] bg-transparent flex flex-col sm:flex-row items-start gap-3 sm:gap-[12px]">
                <WalletIcon
                  image={walletData.iconUrl}
                  onChange={(url, file) =>
                    setWalletData(prev => ({ ...prev, iconUrl: url, iconFile: file }))
                  }
                />
                <div className="w-full sm:w-[363px] h-[146px] bg-white flex justify-center">
                  <WalletName
                    value={walletData.name}
                    onChange={(name) => setWalletData(prev => ({ ...prev, name }))}
                  />
                </div>
              </div>

              {/* Wallet Type Label */}
              <div className="w-full sm:w-[552px] h-[16px] bg-transparent mt-2 sm:mt-[40px] flex flex-row items-center justify-start">
                <p className="text-sm sm:text-[16px]">Wallet Type</p>
              </div>

              {/* Finance Panel */}
              <div className="w-full sm:w-[550px] h-[40px] bg-transparent mt-2 sm:mt-[15px] gap-4 sm:gap-[17px] flex flex-row flex-wrap sm:flex-nowrap">
                <FinancePanel
                  values={{
                    Expense: {
                      budget: walletData.budget,
                      showDailyBudget: walletData.showDailyBudget
                    },
                    Income: {
                      goal: walletData.goal,
                      showDailyGoal: walletData.showDailyGoal
                    },
                    Both: {
                      budget: walletData.budget,
                      goal: walletData.goal,
                      showDailyBudget: walletData.showDailyBudget,
                      showDailyGoal: walletData.showDailyGoal
                    }
                  }}
                  onChange={(type, newValues) => {
                    setWalletData(prev => ({
                      ...prev,
                      type,
                      budget: newValues.budget ?? prev.budget,
                      goal: newValues.goal ?? prev.goal,
                      showDailyBudget: newValues.showDailyBudget ?? false,
                      showDailyGoal: newValues.showDailyGoal ?? false
                    }));
                  }}
                  onCreate={handleCreateWallet} // Trigger wallet creation
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddWallet;
