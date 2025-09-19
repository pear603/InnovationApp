import "../tailwind.css";
import AddBtn from "../components/AddBtn";
import Wallet from "../components/Wallet";
import { useEffect, useState } from "react";
import { supabase } from "../assets/supabaseClient";

const WalletList = () => {
  const [fetchError, setFetchError] = useState(null);
  const [wallets, setWallets] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      const { data, error } = await supabase
        .from("Wallet")
        .select("Wallet_id, WalletName, WalletIcon"); 

      if (error) {
        setFetchError("Could not fetch the wallets");
        setWallets(null);
        console.log(error);
      } else if (data) {

        const walletsWithUrl = data.map((wallet) => ({
          id: wallet.Wallet_id,
          name: wallet.WalletName,
          imageUrl: wallet.WalletIcon
        }));
        setWallets(walletsWithUrl);
        setFetchError(null);
      }
    };

    fetchWallets();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-[#E2EFF3]">
      <div className="w-screen h-screen flex flex-col">
        <p className="text-[32px] ml-12 mt-6">Wallets</p>

        <div className="w-screen h-screen flex justify-center items-center text-center">
          <div className="text-[#969393] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {fetchError && <p>{fetchError}</p>}

            {wallets && wallets.length > 0 ? (
              wallets.map((wallet) => (
                <Wallet
                  key={wallet.id}
                  name={wallet.name}
                  imageUrl={wallet.imageUrl} 
                />
              ))
            ) : (
              !fetchError && <p>No wallets found</p>
            )}
          </div>
        </div>
      </div>
      <AddBtn />
    </div>
  );
};

export default WalletList;
