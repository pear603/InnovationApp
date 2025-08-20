import "../tailwind.css";

import WalletIcon from "../components/WalletIcon";
function BalanceAll() {
  return (
    <>
      <div>
        <div className="w-[739px] h-[197px] bg-white rounded-lg flex flex-row px-[12px] py-[12px] gap-[36px] border border-black/25">
          <WalletIcon className="mt-[12px]"/>
          <div className="w-[292px] h-[155px] flex flex-col bg-white">
            <p className="text-[24px] gap-[8px] "> Wallet Summary</p>
            <p className="text-[40px] gap-[8px]"> Balance 1681 ฿</p>
            <p className="text-[20px] text-[#5C5C5C] underline gap-[6px]"> 4 Wallets</p>
            <p className="text-[20px] text-[#5C5C5C] "> 3 Goals Achieved</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default BalanceAll;
