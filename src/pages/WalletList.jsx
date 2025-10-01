import "../tailwind.css";
import AddBtn from "../components/AddBtn";
import Wallet from "../components/Wallet";
import { useEffect, useState } from "react";
import { supabase } from "../assets/supabaseClient";
import { Link } from "react-router-dom";

const WalletList = () => {
  const [fetchError, setFetchError] = useState(null);
  const [wallets, setWallets] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      const { data, error } = await supabase
        .from("Wallet")
        .select("Wallet_id, WalletName, WalletIcon, WalletType"); 

      if (error) {
        setFetchError("Could not fetch the wallets");
        setWallets(null);
        console.log(error);
      } else if (data) {
        const walletsWithUrl = data.map((wallet) => ({
          id: wallet.Wallet_id,
          name: wallet.WalletName,
          imageUrl: wallet.WalletIcon,
          type: wallet.WalletType, 
        }));
        setWallets(walletsWithUrl);
        setFetchError(null);
      }
    };

    fetchWallets();
  }, []);

  const getWalletLink = (wallet) => {
    switch (wallet.type?.toLowerCase()) {
      case "expense":
        return `/expense-wallet/${wallet.id}`;
      case "income":
        return `/income-wallet/${wallet.id}`;
      case "both":
        return `/both-wallet/${wallet.id}`;
      default:
        return `/wallet/${wallet.id}`; 
    }
  };

  return (
    <div className="relative w-full min-h-screen h-full bg-[#E2EFF3] flex justify-center pt-8">
      <div className="w-full h-full flex flex-col gap-4">
        <p className="text-[32px] mx-20">Wallets</p>

        {fetchError ? (
          <p className="text-center mt-4">{fetchError}</p>
        ) : wallets && wallets.length > 0 ? (
          <div className="flex  items-top text-center  h-full mx-20">
            <div className="text-[#969393] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-col-6 gap-x-12 ">
              {wallets.map((wallet) => (
                <Link key={wallet.id} to={getWalletLink(wallet)}>
                  <Wallet
                    name={wallet.name}
                    imageUrl={wallet.imageUrl}
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <p className="text-gray-600 text-lg text-center">
              Add another wallet <br />
              take full control of your money! Yeah
            </p>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 right-6">
        <AddBtn />
      </div>
    </div>
  );
};

export default WalletList;
