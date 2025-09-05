import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import InWallet from "./pages/InWallet.jsx";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import AddIncomeTrans from "./pages/AddIncomeTrans.jsx";
import AddExpenseTrans from "./pages/AddExpenseTrans.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <App/> */}
      <AddExpenseTrans/>
    </BrowserRouter>
  </StrictMode>
);
