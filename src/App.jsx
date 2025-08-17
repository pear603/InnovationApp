import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import AddWallet from "./pages/AddWallet.jsx";
import WalletAnalytic from "./pages/WalletAnalytic.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/wallet" element={<AddWallet />}></Route>
          <Route path="/walletanalytic" element={<WalletAnalytic />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
