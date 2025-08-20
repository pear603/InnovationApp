import "../tailwind.css";

import WalletIcon from "../components/WalletIcon";
function Balance() {
  return (
    <>
      <div>
        <div className="w-[739px] h-[197px] bg-white rounded-lg flex items-center px-[12px] gap-[36px] border border-black/25">
          <WalletIcon/>
          <p className="text-[40px]"> Balance 1680 ฿ </p>
        </div>
      </div>
    </>
  );
}

export default Balance;
