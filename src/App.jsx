import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from './assets/supabaseClient';
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import AddWallet from "./pages/AddWallet.jsx";
import WalletAnalytic from "./pages/WalletAnalytic.jsx";
import WalletList from "./pages/WalletList.jsx";
import AddTag from "./pages/AddTag.jsx";
import Demo from "./pages/Demo.jsx";
import Login from "./pages/Login.jsx";
import AddExpenseTrans from "./pages/AddExpenseTrans.jsx";
import AddIncomeTrans from "./pages/AddIncomeTrans.jsx";
import BothWalletDetails from "./pages/BothWalletDetails.jsx";
import ExpenseWalletDetails from "./pages/ExpenseWalletDetails.jsx";
import IncomeWalletDetails from "./pages/IncomeWalletDetails.jsx";



function App() {
  const [count, setCount] = useState(0);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    })

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {session ? <Nav /> : null}
      <main>
        <Routes>
          <Route
            path="/login"
            element={!session ? <Login /> : <Navigate to="/walletlist" replace />}
          />

          <Route
            path="/"
            element={session ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/wallet"
            element={session ? <AddWallet /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/walletanalytic"
            element={session ? <WalletAnalytic /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/walletlist"
            element={session ? <WalletList /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/addTag"
            element={session ? <AddTag /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/addIncomeTx"
            element={session ? <AddIncomeTrans /> : <Navigate to="/login" replace />} // for testing
          />

          <Route
            path="/ExpenseTx/:id?"
            element={session ? <AddExpenseTrans /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/IncomeTx"
            element={session ? <AddIncomeTrans /> : <Navigate to="/login" replace />}
          />


          <Route
            path="/walletDetails"
            element={session ? <IncomeWalletDetails /> : <Navigate to="/login" replace />} // for testing
          />
          <Route
            path="/expense-wallet/:id"
            element={session ? <ExpenseWalletDetails /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/income-wallet/:id"
            element={session ? <IncomeWalletDetails /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/both-wallet/:id"
            element={session ? <BothWalletDetails /> : <Navigate to="/login" replace />}
          />


          <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
