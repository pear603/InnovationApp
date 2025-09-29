// components/Ohma/Transaction.jsx
import "../../tailwind.css";

function Transaction({ transaction, index }) {
  // Use the correct field names from your schema
  const { TxNote, TxAmount, CreatedDate, Tag, TxType } = transaction;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpense = TxType?.TxType === 'Expense';
  const amountClass = isExpense ? 'text-red-600' : 'text-green-600';
  const amountPrefix = isExpense ? '-' : '+';

  return (
    <div className={`flex flex-row items-center justify-between w-full p-4 border-b border-black/25 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex flex-col">
        <div className="text-[16px] font-semibold">
          {Tag?.Name || 'Uncategorized'} {/* Fixed: Tag.Name not Tag.TagName */}
        </div>
        <div className="text-[14px] text-gray-600">
          {TxNote || 'No description'}
        </div>
        <div className="text-[12px] text-gray-500">
          {formatDate(CreatedDate)}
        </div>
      </div>
      <div className={`text-[18px] font-bold ${amountClass}`}>
        {amountPrefix}${Math.abs(TxAmount || 0).toLocaleString()}
      </div>
    </div>
  );
}

export default Transaction;