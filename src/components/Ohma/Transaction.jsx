// components/Ohma/Transaction.jsx
import "../../tailwind.css";

function Transaction({ transaction, index }) {
  // Use the correct field names from your schema
  const { TxNote, TxAmount, CreatedDate, Tag, TxType } = transaction;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const base =
    "w-full h-[66px] border-b border-[rgba(0,0,0,0.25)] gap-[10px] px-[16px] py-[8px]";

  const isExpense = TxType?.TxType === "Expense";
  const amountClass = isExpense ? "text-[#E16451]" : "text-[#9AD24B]";
  const amountPrefix = isExpense ? "-" : "+";

  return (
    // <div className={`flex flex-row items-center justify-between w-full p-4 border-b border-black/25 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
    //   <div className="flex flex-col">
    //     <div className="text-[16px] font-semibold">
    //       {Tag?.Name || 'Uncategorized'} {/* Fixed: Tag.Name not Tag.TagName */}
    //     </div>
    //     <div className="text-[14px] text-gray-600">
    //       {TxNote || 'No description'}
    //     </div>
    //     <div className="text-[12px] text-gray-500">
    //       {formatDate(CreatedDate)}
    //     </div>
    //   </div>
    //   <div className={`text-[18px] font-bold ${amountClass}`}>
    //     {amountPrefix}${Math.abs(TxAmount || 0).toLocaleString()}
    //   </div>
    // </div>
    <div className={`${base} `}>
      <div className="w-full h-[50px] flex gap-[12px]">
        {/* <div className="w-[46px] h-[46px] rounded-full bg-[#D9D9D9] flex-shrink-0 "></div> */}
        <div className="w-full h-[50px]">
          <div
            className={`w-full h-[24px] flex justify-between items-center text-xl ${amountClass}`}
          >
            <p>{Tag?.Name || 'Uncategorized'}</p>
            <p>{amountPrefix}${Math.abs(TxAmount || 0).toLocaleString()} ฿</p>
          </div>
          <div className="w-full h-[24px] flex justify-between items-center text-base text-[#707376] gap-6">
            <p className="truncate">{(TxNote || 'No description').slice(0, 20)}{(TxNote?.length > 20) && '…'}</p>
            <p className="whitespace-nowrap">{formatDate(CreatedDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
