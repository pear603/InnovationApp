import "../../tailwind.css";

function Transaction({ variant = "expense" }) {
  const base =
    "w-full h-[66px] border-b border-[rgba(0,0,0,0.25)] gap-[10px] px-[16px] py-[8px]";
  const variants = {
    income: "text-[#9AD24B]",
    expense: "text-[#E16451]",
  };
  const sign = {
    income: "+",
    expense: "-",
  };

  return (
    <div className={`${base} `}>
      <div className="w-full h-[50px] flex gap-[12px]">
        <div className="w-[46px] h-[46px] rounded-full bg-[#D9D9D9] flex-shrink-0 "></div>
        <div className="w-full h-[50px]">
          <div
            className={`w-full h-[24px] flex justify-between items-center text-xl ${variants[variant]}`}
          >
            <p>Top Supermarket</p>
            <p>{sign[variant]}70 ฿</p>
          </div>
          <div className="w-full h-[24px] flex justify-between items-center text-base text-[#707376]">
            <p>Orange Juice</p>
            <p>16/6/25 10:25</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Transaction;
