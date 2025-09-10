import "../tailwind.css";

import Nav from "../components/Nav";
import BalanceAll from "../components/BalanceAll";
import PieStats from "../components/Ohma/PieStats";
import GoodToKnow from "../components/Ohma/GoodToKnow";
import GoalAchieved from "../components/Ohma/GoalAchieved";
import BarGraph from "../components/Ohma/BarGraph";
import Transaction from "../components/Ohma/Transaction";

function WalletAnalytic() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[1280px] h-[1011px] pt-[38px] ">
                <p className="text-[32px]  ml-auto pb-[16px]">Wallet Analytic</p>
                <div className="w-[1280px] h-[956px] bg-transparent flex flex-row gap-[16px]">
                    <div className="w-[741px] h-[922px] bg-transparent">
                        <div className="w-[741px] h-[709px] px-[40px] py-[15px] bg-transparent rounded-lg border border-black/25  ">
                            <p className="text-[24px]  ml-auto pb-[10px]">Statistics</p>
                            <div className="w-[661px] h-[604px] bg-transparent">
                                <div className="w-[661px] bg-transparent pb-[22px] flex flex-col sm:flex-row gap-4">
                                    <div className="sm:w-[323px] flex-shrink-0">
                                        <PieStats />
                                    </div>
                                    <div className="sm:w-[322px] flex flex-col gap-4">
                                        <GoodToKnow />
                                        <GoalAchieved />
                                    </div>
                                </div>


                                <div className="w-[661px] h-[291px] bg-transparent">
                                    <BarGraph />
                                </div>
                            </div>
                        </div>

                        <div className="w-[739px] h-[197px] bg-transparent mt-[16px] flex flex-row">
                            <BalanceAll />
                        </div>
                    </div>
                    <div className="w-[523px] h-[922px] bg-transparent px-[40px] py-[27px] flex flex-col rounded-lg border border-black/25 ">
                        <p className="text-[24px] pb-[48px]">Transaction</p>
                        <div className="w-[443px] h-[790px] bg-transparent px-[40px] py-[15px] mx-auto flex flex-col  ">
                            <Transaction /> <Transaction />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletAnalytic;
