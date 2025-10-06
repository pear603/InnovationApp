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
      TxNote: transaction.TxNote

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
      TxNote: transaction.TxNote

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
    Income: "#9AD24B",  // green
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


 processPieData: (transactions) => {
  const summary = AnalyticService.processTransactions(transactions);

  const labels = Object.keys(summary); // e.g., ["Income"] or ["Expense"]

  // Sum all tags per type
  const data = labels.map((type) =>
    Object.values(summary[type]).reduce((total, value) => total + value, 0)
  );

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
}

};
