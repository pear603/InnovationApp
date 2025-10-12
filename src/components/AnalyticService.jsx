import { supabase } from "../assets/supabaseClient";

export const AnalyticService = {
  getTransaction: async (userId) => {
    const { data, error } = await supabase
      .from("Transaction")
      .select(
        `
      Tx_id,
      TxNote,
      TxAmount,
      Type:TxType_id ( TxType ),
      Tag:Tag_id ( Name ),
      CreatedDate,
      Wallet:Wallet_id ( User_id )
    `
      )
      .eq("Wallet.User_id", userId);

    if (error) throw new Error(error.message);

    return data.map((transaction) => ({
      TxAmount: transaction.TxAmount,
      TxType: transaction.Type || "Unknown",
      Tag: transaction.Tag || "Other",
      CreatedDate: transaction.CreatedDate,
      TxNote: transaction.TxNote,
    }));
  },

  getWalletTransaction: async (walletId) => {
    const { data, error } = await supabase
      .from("Transaction")
      .select(
        `
      Tx_id,
      TxNote,
      TxAmount,
      Type:TxType_id ( TxType ),
      Tag:Tag_id ( Name ),
      CreatedDate,
      Wallet_id
    `
      )
      .eq("Wallet_id", walletId);

    if (error) throw new Error(error.message);

    return data.map((transaction) => ({
      TxAmount: transaction.TxAmount,
      TxType: transaction.Type || "Unknown",
      Tag: transaction.Tag || "Other",
      CreatedDate: transaction.CreatedDate,
      TxNote: transaction.TxNote,
    }));
  },

  processTransactions: (transactions) => {
    const summary = {};
    transactions.forEach((tx) => {
      const type = tx.TxType?.TxType;
      const tag = tx.Tag?.Name;
      if (!summary[type]) summary[type] = {};
      if (!summary[type][tag]) summary[type][tag] = 0;
      summary[type][tag] += tx.TxAmount;
    });
    return summary;
  },
  // transactions: array from AnalyticService.getTransaction(userId)
  processBarData: (transactions) => {
    const summary = AnalyticService.processTransactions(transactions);

    // get all unique tags across all types
    const allTags = [
      ...new Set(Object.values(summary).flatMap((tags) => Object.keys(tags))),
    ];

    // Define color mapping per type
    const typeColors = {
      Income: "#9AD24B", // green
      Expense: "#E16451", // red
      // add more types if needed
    };

    // Build datasets
    const datasets = Object.keys(summary).map((type) => ({
      label: type, // "Income" or "Expense"
      data: allTags.map((tag) => summary[type][tag] || 0),
      backgroundColor: typeColors[type] || "#36A2EB", // fallback color
    }));

    return {
      labels: allTags,
      datasets,
    };
  },

  processPieData: (transactions, budget) => {
    // summary per type (Income / Expense)
    const summary = AnalyticService.processTransactions(transactions);

    // Sum all income
    const totalIncome = summary["Income"]
      ? Object.values(summary["Income"]).reduce((sum, val) => sum + val, 0)
      : 0;

    // Sum all expense
    const totalExpense = summary["Expense"]
      ? Object.values(summary["Expense"]).reduce((sum, val) => sum + val, 0)
      : 0;

    // Calculate remaining balance (budget minus expenses)
    const remaining = Math.max(budget - totalExpense, 0);

    const labels = ["Avaliable Balance", "Income", "Expense"];
    const data = [remaining, totalIncome, totalExpense];

    // Define color mapping per type
    const typeColors = {
      Income: "#9AD24B",
      Expense: "#E16451",
    };

    const backgroundColor = labels.map((type) => typeColors[type] || "#36A2EB"); // default color if type not defined

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
        },
      ],
    };
  },

  processBudget: async (userId) => {
    try {
      // 1️⃣ Fetch all wallets for this user
      const { data: wallets, error: walletError } = await supabase
        .from("Wallet")
        .select("Wallet_id, WalletType, User_id")
        .eq("User_id", userId);

      if (walletError) throw new Error(walletError.message);

      if (!wallets || wallets.length === 0) return 0;

      // Separate wallet IDs by type
      const bothWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "both")
        .map((w) => w.Wallet_id);

      const expenseWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "expense")
        .map((w) => w.Wallet_id);

      // 2️⃣ Fetch budgets for each relevant wallet type
      const [bothRes, expenseRes] = await Promise.all([
        bothWalletIds.length
          ? supabase
              .from("BothWallet")
              .select("Wallet_id, Budget")
              .in("Wallet_id", bothWalletIds)
          : { data: [], error: null },
        expenseWalletIds.length
          ? supabase
              .from("ExpenseWallet")
              .select("Wallet_id, Budget")
              .in("Wallet_id", expenseWalletIds)
          : { data: [], error: null },
      ]);

      if (bothRes.error) throw new Error(bothRes.error.message);
      if (expenseRes.error) throw new Error(expenseRes.error.message);

      const bothWallets = bothRes.data || [];
      const expenseWallets = expenseRes.data || [];

      // 3️⃣ Combine all base budgets
      const baseBalance = [...bothWallets, ...expenseWallets].reduce(
        (sum, w) => sum + (Number(w.Budget) || 0),
        0
      );
      return baseBalance;
    } catch (error) {
      console.error("Error processing pie chart data:", error);
    }
  },

  processAllBalance: async (userId) => {
    try {
      // 1️⃣ Fetch all wallets for this user
      const { data: wallets, error: walletError } = await supabase
        .from("Wallet")
        .select("Wallet_id, WalletType, User_id")
        .eq("User_id", userId);

      if (walletError) throw new Error(walletError.message);

      if (!wallets || wallets.length === 0) return 0;

      // Separate wallet IDs by type
      const bothWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "both")
        .map((w) => w.Wallet_id);

      const expenseWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "expense")
        .map((w) => w.Wallet_id);

      // 2️⃣ Fetch budgets for each relevant wallet type
      const [bothRes, expenseRes] = await Promise.all([
        bothWalletIds.length
          ? supabase
              .from("BothWallet")
              .select("Wallet_id, Budget")
              .in("Wallet_id", bothWalletIds)
          : { data: [], error: null },
        expenseWalletIds.length
          ? supabase
              .from("ExpenseWallet")
              .select("Wallet_id, Budget")
              .in("Wallet_id", expenseWalletIds)
          : { data: [], error: null },
      ]);

      if (bothRes.error) throw new Error(bothRes.error.message);
      if (expenseRes.error) throw new Error(expenseRes.error.message);

      const bothWallets = bothRes.data || [];
      const expenseWallets = expenseRes.data || [];

      // 3️⃣ Combine all base budgets
      const baseBalance = [...bothWallets, ...expenseWallets].reduce(
        (sum, w) => sum + (Number(w.Budget) || 0),
        0
      );

      // 4️⃣ Fetch all transactions
      const allTx = await AnalyticService.getTransaction(userId);

      // 5️⃣ Compute transaction-based balance
      const transactionSum = (allTx || []).reduce((sum, tx) => {
        const type = tx.TxType?.TxType || "";
        const amount = Number(tx.TxAmount) || 0;

        if (type === "Income") return sum + amount;
        if (type === "Expense") return sum - amount;

        return sum;
      }, 0);

      // 6️⃣ Final total balance
      const totalBalance = baseBalance + transactionSum;

      return totalBalance;
    } catch (error) {
      console.error("Error processing total balance:", error);
      return { baseBalance: 0, transactionSum: 0, totalBalance: 0 };
    }
  },

  countUserWallets: async (userId) => {
    const { count, error } = await supabase
      .from("Wallet")
      .select("Wallet_id", { count: "exact", head: true })
      .eq("User_id", userId);

    if (error) {
      console.error("Error fetching wallet count:", error.message);
      return 0;
    }

    return count || 0;
  },

  archivedWallet: async (userId) => {
    try {
      // 1️⃣ Get all wallets for this user
      const { data: wallets, error: walletError } = await supabase
        .from("Wallet")
        .select("Wallet_id, WalletType, User_id")
        .eq("User_id", userId);

      if (walletError) throw new Error(walletError.message);
      if (!wallets.length) return 0;

      // 2️⃣ Split wallets by type
      const bothWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "both")
        .map((w) => w.Wallet_id);

      const expenseWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "expense")
        .map((w) => w.Wallet_id);

      const incomeWalletIds = wallets
        .filter((w) => w.WalletType?.toLowerCase() === "income")
        .map((w) => w.Wallet_id);

      // 3️⃣ Fetch budgets/goals for each type
      const [bothRes, expenseRes, incomeRes] = await Promise.all([
        bothWalletIds.length
          ? supabase
              .from("BothWallet")
              .select("Wallet_id, Budget, Goal")
              .in("Wallet_id", bothWalletIds)
          : { data: [] },
        expenseWalletIds.length
          ? supabase
              .from("ExpenseWallet")
              .select("Wallet_id, Budget")
              .in("Wallet_id", expenseWalletIds)
          : { data: [] },
        incomeWalletIds.length
          ? supabase
              .from("IncomeWallet")
              .select("Wallet_id, Goal")
              .in("Wallet_id", incomeWalletIds)
          : { data: [] },
      ]);

      const bothWallets = bothRes.data || [];
      const expenseWallets = expenseRes.data || [];
      const incomeWallets = incomeRes.data || [];

      // 4️⃣ Fetch all transactions for these wallets
      const allWalletIds = [
        ...bothWalletIds,
        ...expenseWalletIds,
        ...incomeWalletIds,
      ];
      const { data: transactions, error: txError } = await supabase
        .from("Transaction")
        .select("Wallet_id, TxAmount, TxType (TxType)")
        .in("Wallet_id", allWalletIds);

      if (txError) throw new Error(txError.message);

      // 5️⃣ Group transactions by wallet
      const txByWallet = {};
      transactions.forEach((tx) => {
        if (!txByWallet[tx.Wallet_id]) txByWallet[tx.Wallet_id] = [];
        txByWallet[tx.Wallet_id].push(tx);
      });

      // 6️⃣ Count how many wallets are archived
      let archivedCount = 0;

      // --- Income wallets ---
      for (const w of incomeWallets) {
        const walletTx = txByWallet[w.Wallet_id] || [];
        const incomeSum = walletTx
          .filter((tx) => tx.TxType?.TxType === "Income")
          .reduce((sum, tx) => sum + tx.TxAmount, 0);
        if (incomeSum >= w.Goal) archivedCount++;
      }

      // --- Expense wallets ---
      for (const w of expenseWallets) {
        const walletTx = txByWallet[w.Wallet_id] || [];
        const expenseSum = walletTx
          .filter((tx) => tx.TxType?.TxType === "Expense")
          .reduce((sum, tx) => sum + tx.TxAmount, 0);
        if (expenseSum < w.Budget) archivedCount++;
      }

      // --- Both wallets ---
      for (const w of bothWallets) {
        const walletTx = txByWallet[w.Wallet_id] || [];
        const incomeSum = walletTx
          .filter((tx) => tx.TxType?.TxType === "Income")
          .reduce((sum, tx) => sum + tx.TxAmount, 0);
        const expenseSum = walletTx
          .filter((tx) => tx.TxType?.TxType === "Expense")
          .reduce((sum, tx) => sum + tx.TxAmount, 0);

        if (incomeSum >= w.Goal && expenseSum < w.Budget) archivedCount++;
      }

      // ✅ Return the total number of archived wallets
      return archivedCount;
    } catch (error) {
      console.error("Error checking archived wallets:", error.message);
      return 0;
    }
  },

  processIncomeProgress(walletInfo, transactions) {
    if (!walletInfo) return console.log("No walletInfo");

    const { monthlyGoal = 0, currentSaved = 0 } = walletInfo;
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const progress = monthlyGoal
      ? Math.min(((currentSaved + totalIncome) / monthlyGoal) * 100, 100)
      : 0;

    const chartData = {
      labels: ["Achieved", "Remaining"],
      datasets: [
        {
          data: [progress, 100 - progress],
          backgroundColor: ["#9AD24B", "#E0E0E0"], // green + gray
          borderWidth: 0,
        },
      ],
    };

    return { progress, chartData };
  },
// AnalyticService.js
  processExpenseProgress(walletInfo, transactions) {
    if (!walletInfo) return null;

    const spent = walletInfo.currentSpent || 0;
    const budget = walletInfo.originalBudget || 0;
    const progressPercent = budget > 0 ? (spent / budget) * 100 : 0;

    const chartData = {
      labels: ["Spent", "Remaining"],
      datasets: [
        {
          data: [spent, Math.max(budget - spent, 0)],
          backgroundColor: ["#E16451", "#E0E0E0"], // red for spent, green for remaining
          borderWidth: 0,
        },
      ],
    };

    return {
      progress: progressPercent,
      chartData,
    };
  }


};
