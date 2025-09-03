import "../tailwind.css";
import Transaction from "../components/Ohma/Transaction.jsx";
import InsertBtn from "../components/InsertBtn.jsx";
import ExpenseBtn from "../components/ExpenseBtn.jsx";
import Wallet from "../components/Wallet.jsx";

function Demo() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* <Transaction variant="income" />
      <Transaction />
      <InsertBtn />
      <ExpenseBtn /> */}
      <Wallet />
    </div>
  );
}
export default Demo;
