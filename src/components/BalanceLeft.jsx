import "../tailwind.css";
import WalletIcon from "../components/WalletIcon";

function BalanceLeft() {
  return (
    <div className="w-full bg-white rounded-lg flex flex-row items-start px-4 py-4 gap-9 border border-black/25">
      <WalletIcon className="mt-3" />

      <div className="flex-1 flex flex-col">
        <p className="text-2xl sm:text-3xl md:text-4xl pb-4">Balance 1681 ฿</p>
        <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C] underline pb-2">
          14 Day Left
        </p>
        <p className="text-base sm:text-lg md:text-xl text-[#5C5C5C]">
          Daily balance 120 ฿
        </p>
      </div>
    </div>
  );
}

export default BalanceLeft;
