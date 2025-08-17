import "../tailwind.css";

import WalletIcon from "../components/WalletIcon";
function BalanceLeft() {
  return (
    <>
      <div>
        <div className="w-[739px] h-[197px] bg-white rounded-lg flex flex-row px-[12px] py-[12px] gap-[36px] border border-black/25">
          <WalletIcon className="mt-[12px]"/>
          <div className="w-[292px] h-[146px] md-[20px] flex flex-col ">
            <p className="text-[40px] pb-[24px]"> Balance 1681 ฿</p>
            <p className="text-[20px] text-[#5C5C5C] underline pb-[6px]"> 14 Day Left</p>
            <p className="text-[20px] text-[#5C5C5C] "> Daily balance 120 ฿</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default BalanceLeft;
