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

    // get all unique tags
    const allTags = [
      ...new Set(Object.values(summary).flatMap((tags) => Object.keys(tags))),
    ];

    const datasets = Object.keys(summary).map((type, idx) => ({
      label: type, // "Income" or "Expense"
      data: allTags.map((tag) => summary[type][tag] || 0),
      backgroundColor: idx === 0 ? "#E16451" : "#9AD24B", // color per type 
    }));

    return {
      labels: allTags,
      datasets,
    };
  },
};
