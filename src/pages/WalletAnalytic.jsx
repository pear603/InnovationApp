import "../tailwind.css";

import Nav from "../components/Nav";
import BalanceAll from "../components/BalanceAll";

function WalletAnalytic() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[1280px] h-[1011px] pt-[38px] ">
                <p className="text-[32px]  ml-auto pb-[16px]">Wallet Analytic</p>
                <div className="w-[1280px] h-[956px] bg-sky-500 flex flex-row gap-[16px]">
                    <div className="w-[741px] h-[922px] bg-black ">
                        <div className="w-[741px] h-[709px] px-[40px] py-[33px] bg-red-100">
                            <p className="text-[24px]  ml-auto pb-[10px]">Statistics</p>
                            <div className="w-[661px] h-[604px] bg-red-200">
                                <div className="w-[661px] h-[291px] bg-red-300 pb-[22px]">
                                </div>
                                <div className="w-[661px] h-[291px] bg-red-400">
                                </div>
                            </div>
                        </div>

                        <div className="w-[739px] h-[197px] bg-green-300 mt-[16px] flex flex-row">
                            <BalanceAll />
                        </div>
                    </div>
                    <div className="w-[523px] h-[922px] bg-green-300 px=[40px] py-[27px] flex flex-col">
                        <p className="text-[24px] pb-[48px]">Transaction</p>
                        <div className="w-[443px] h-[790px] bg-red-300 px=[40px] py-[27px] mx-auto">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletAnalytic;
