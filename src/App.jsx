import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import AddWallet from "./pages/AddWallet.jsx";
import WalletAnalytic from "./pages/WalletAnalytic.jsx";
import WalletList from "./pages/WalletList.jsx";
import AddTag from "./pages/AddTag.jsx";
import Demo from "./pages/Demo.jsx";

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
          <Route path="/walletlist" element={<WalletList />}></Route>
          <Route path="/addTag" element={<AddTag />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
