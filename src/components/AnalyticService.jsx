import { supabase } from "../assets/supabaseClient";

export const AnalyticService = {
  getTransaction: async (userId) => {
    const { data, error } = await supabase
      .from("Transaction")
      .select(
        `
      TxAmount,
      Type:TxType_id ( TxType ),
      Tag:Tag_id ( Name ),
      Wallet:Wallet_id ( User_id )
    `
      )
      .eq("Wallet.User_id", userId);

    if (error) throw new Error(error.message);

    return data.map((transaction) => ({
      amount: transaction.TxAmount,
      type: transaction.Type?.TxType || "Unknown",
      tag: transaction.Tag?.Name || "Other",
    }));
  },

  processTransactions: (transactions) => {
    const summary = {};
    transactions.forEach((tx) => {
      const type = tx.type;
      const tag = tx.tag;
      if (!summary[type]) summary[type] = {};
      if (!summary[type][tag]) summary[type][tag] = 0;
      summary[type][tag] += tx.amount;
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
      backgroundColor: idx === 0 ? "#36A2EB" : "#FF6384", // color per type
    }));

    return {
      labels: allTags,
      datasets,
    };
  },
};
