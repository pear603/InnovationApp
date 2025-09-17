// src/pages/AddWallet.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../assets/supabaseClient";
import WalletIcon from "../components/WalletIcon";
import WalletName from "../components/WalletName";
import WalletService from "../components/WalletService";
import "../tailwind.css";

function AddWallet() {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState({
    name: "",
    iconUrl: null,
    iconFile: null,
    type: "Expense",
    budget: "",
    goal: "",
    showDailyBudget: false,
    showDailyGoal: false
  });

  const handleCreateWallet = async () => {
    let iconUrl = null;

    // Upload image to Storage
    if (walletData.iconFile) {
      const fileName = `${Date.now()}_${walletData.iconFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("WalletIcon")
        .upload(fileName, walletData.iconFile, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data: publicData } = supabase.storage
          .from("WalletIcon")
          .getPublicUrl(fileName);
        iconUrl = publicData.publicUrl;
      }
    }

    const walletId = crypto.randomUUID();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("You must be logged in to create a wallet");
      return;
    }

    const now = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" });

    // Insert into Wallet table
    try {
      const { error: walletError } = await supabase.from("Wallet").insert([{
        Wallet_id: walletId,
        WalletName: walletData.name || "Unnamed Wallet",
        WalletType: walletData.type,
        DailyAvaliable: walletData.showDailyBudget || walletData.showDailyGoal ? "On" : "Off",
        WalletIcon: iconUrl,
        StartDate: now,
        User_id: user.id
      }]);

      if (walletError) {
        if (walletError.code === '23505' || walletError.message.includes('duplicate key')) {
          alert("Wallet name already exists");
        } else {
          alert(`CreateWalletError: ${walletError.message}`);
        }
        return;
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error creating wallet");
      return;
    }

    // Insert into type-specific table
    try {
      if (walletData.type === "Expense") {
        await supabase.from("ExpenseWallet").insert([{
          Wallet_id: walletId,
          Budget: Number(walletData.budget)
        }]);
      } else if (walletData.type === "Income") {
        await supabase.from("IncomeWallet").insert([{
          Wallet_id: walletId,
          Goal: Number(walletData.goal)
        }]);
      } else if (walletData.type === "Both") {
        await supabase.from("BothWallet").insert([{
          Wallet_id: walletId,
          Budget: Number(walletData.budget) || 0,
          Goal: Number(walletData.goal) || 0
        }]);
      }
    } catch (typeError) {
      console.error("Type-specific wallet insert error:", typeError);
      alert(`Failed to create type-specific wallet: ${typeError.message}`);
      return;
    }

    alert("CreateWalletSuccess");

    // Reset form
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

    navigate("/walletlist");
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <p className="text-2xl sm:text-[32px] ml-4 sm:ml-12 mt-4 sm:mt-6">Wallets</p>

      <div className="w-full sm:w-[1273px] h-auto sm:h-[915px] pt-6 sm:pt-[60px] mx-auto">
        <div className="flex justify-center items-center pt-6 sm:pt-[60px]">
          <div className="w-[90%] sm:w-[632px] h-auto sm:h-[424px] bg-white rounded-lg border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)]">

            {/* Close Button */}
            <div className="w-full h-[40px] bg-white rounded-lg border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.2)] relative">
              <div
                className="w-[25px] h-[25px] bg-white border border-[rgba(0,0,0,0.25)] shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200"
                onClick={() => navigate("/walletlist")}
              >
                ✖
              </div>
            </div>

            {/* Wallet Icon + Name */}
            <div className="w-full h-auto sm:h-[344px] mt-5 sm:mt-[20px] flex flex-col items-center bg-transparent">
              <div className="w-full sm:w-[631px] h-auto sm:h-[173px] px-4 sm:px-[40px] bg-transparent flex flex-col sm:flex-row items-start gap-3 sm:gap-[12px]">
                <WalletIcon
                  image={walletData.iconUrl}
                  onChange={(url, file) => setWalletData(prev => ({ ...prev, iconUrl: url, iconFile: file }))}
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

              {/* WalletService */}
              <div className="w-full sm:w-[550px] bg-transparent mt-2 sm:mt-[15px] gap-4 sm:gap-[17px] flex flex-row flex-wrap sm:flex-nowrap">
                <WalletService
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
                  onCreate={handleCreateWallet}
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
