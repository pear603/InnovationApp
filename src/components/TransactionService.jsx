import { supabase } from '../assets/supabaseClient';

export const TransactionService = {

    // Calculate remaining days
    calculateDaysLeft: (startDateString) => {
        if (!startDateString) return 30;
        const start = new Date(startDateString);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        const now = new Date();
        const todayThai = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const endThai = new Date(end.getTime() + 7 * 60 * 60 * 1000);
        const timeDiff = endThai.getTime() - todayThai.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return Math.max(0, daysLeft);
    },

    // Get wallet info (expense/income/both)
    validateWalletType: async (walletId, walletType) => {
        if (!walletId) return null;
        if (!walletType) return null;

        const walletData = {};

        // Fetch Wallet base info
        const { data: wallet, error: walletError } = await supabase
            .from('Wallet')
            .select('WalletName, WalletType, DailyAvaliable, StartDate')
            .eq('Wallet_id', walletId)
            .single();

        if (walletError) throw walletError;
        if (!wallet) return null;

        walletData.walletType = wallet.WalletType || '';
        walletData.walletName = wallet.WalletName || '';
        walletData.enableDailyBudget = wallet.DailyAvaliable !== null;
        walletData.startDate = wallet.StartDate || new Date().toISOString();
        walletData.daysLeft = TransactionService.calculateDaysLeft(wallet.StartDate);

        const daysLeftNum = Number(walletData.daysLeft);

        // Expense Wallet
        if (walletType.toLowerCase() === 'expense') {
            const { data: expenseWallet, error: budgetError } = await supabase
                .from('ExpenseWallet')
                .select('Budget')
                .eq('Wallet_id', walletId)
                .single();

            if (budgetError) throw budgetError;

            walletData.originalBudget = Number(expenseWallet?.Budget || 0); //Budget

            // Fetch all transactions
            const { data: transactions, error: txError } = await supabase
                .from('Transaction')
                .select('TxAmount, TxType:TxType_id(TxType)')
                .eq('Wallet_id', walletId);

            if (txError) throw txError;

            walletData.currentSpent = transactions
                ?.filter(tx => tx.TxType?.TxType === 'Expense')
                .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0) || 0;

            walletData.remainingBudget = walletData.originalBudget - walletData.currentSpent; //calcBudget

            walletData.dailyBudget = daysLeftNum > 0 //calDailyBudget
                ? Math.floor(walletData.remainingBudget / daysLeftNum)
                : Math.floor(walletData.remainingBudget);

            return walletData;
        }

        // Income Wallet
        if (walletType.toLowerCase() === 'income') {
            const { data: incomeWallet, error: goalError } = await supabase
                .from('IncomeWallet')
                .select('Goal')
                .eq('Wallet_id', walletId)
                .single();

            if (goalError) throw goalError;

            walletData.monthlyGoal = Number(incomeWallet?.Goal || 0); //Income

            // Fetch all transactions
            const { data: transactions, error: txError } = await supabase
                .from('Transaction')
                .select('TxAmount, TxType:TxType_id(TxType)')
                .eq('Wallet_id', walletId);

            if (txError) throw txError;

            walletData.currentSaved = transactions //CalcIncome
                ?.filter(tx => tx.TxType?.TxType === 'Income')
                .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0) || 0;

            walletData.dailyGoal = daysLeftNum > 0 //CalcDailyGoal
                ? Math.floor((walletData.monthlyGoal - walletData.currentSaved) / daysLeftNum)
                : 0;

            return walletData;
        }

        // Both Wallet
        if (wallet.WalletType.toLowerCase() === 'both' || walletType.toLowerCase() === 'both') {
            const { data: bothWallet, error } = await supabase
                .from("BothWallet")
                .select("Budget, Goal")
                .eq("Wallet_id", walletId)
                .single();

            if (error) console.error("Error fetching BothWallet:", error);

            walletData.originalBudget = Number(bothWallet?.Budget || 0); //Budget
            walletData.monthlyGoal = Number(bothWallet?.Goal || 0); //Income

            // Fetch all transactions
            const { data: transactions, error: txError } = await supabase
                .from("Transaction")
                .select("TxAmount, TxType:TxType_id(TxType)")
                .eq("Wallet_id", walletId);

            if (txError) throw txError;

            walletData.currentSpent = transactions
                ?.filter(tx => tx.TxType?.TxType === "Expense")
                .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0) || 0;

            walletData.currentSaved = transactions
                ?.filter(tx => tx.TxType?.TxType === "Income")
                .reduce((sum, tx) => sum + (parseFloat(tx.TxAmount) || 0), 0) || 0;

            walletData.remainingBudget = walletData.originalBudget - walletData.currentSpent; //calcBudget
            walletData.remainingToGoal = walletData.monthlyGoal - walletData.currentSaved; //calcIncome

            walletData.dailyBudget = daysLeftNum > 0 //calcDailyBudget
                ? Math.floor(walletData.remainingBudget / daysLeftNum)
                : Math.floor(walletData.remainingBudget);

            walletData.dailyGoal = daysLeftNum > 0 // calcDailyGoal
                ? Math.floor(walletData.remainingToGoal / daysLeftNum)
                : 0;

            return walletData;
        }

        return walletData;
    },

    // Get paginated transactions
    getTransactions: async (walletId, from = 0, to = 9) => {
        const { data, count, error } = await supabase
            .from("Transaction")
            .select(
                `
                *,
                Tag:Tag_id(Name),
                TxType:TxType_id(TxType)
            `,
                { count: "exact" }
            )
            .eq("Wallet_id", walletId)
            .order("CreatedDate", { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { data: data || [], count: count || 0 };
    },
    
    // Validate expense transaction
    validateExpense: (walletId, tagId, txAmount, remainingBudget) => {
        if (!walletId) throw new Error('Wallet ID is required');
        if (!tagId) throw new Error('Please select a tag');

        const amountNum = parseFloat(txAmount);
        if (!txAmount || isNaN(amountNum) || amountNum <= 0)
            throw new Error('Please enter a valid amount (numbers only)');

        if (amountNum > remainingBudget)
            throw new Error(`Insufficient budget. Remaining: $${remainingBudget.toFixed(2)}`);

        return true;
    },
    // Validate income transaction
    validateIncome: (walletId, tagId, txAmount) => {
        if (!walletId) throw new Error('Wallet ID is required');
        if (!tagId) throw new Error('Please select a tag');

        const amountNum = parseFloat(txAmount);
        if (!txAmount || isNaN(amountNum) || amountNum <= 0)
            throw new Error('Please enter a valid amount (numbers only)');

        return true;
    },

    // Validate note
    validateNote: (note) => {
        if (note && (note.length < 1 || note.length > 20))
            throw new Error('Note must be between 1 and 20 characters');
        return true;
    },

    // Insert transaction 
    insertTransaction: async (walletId, tagId, txAmount, note, type) => {  //walletID, tagID , txAmount , note
        const transactionId = crypto.randomUUID();
        const { data: txType, error: txTypeError } = await supabase
            .from("TxType")
            .select("TxType_id")
            .eq("TxType", type)
            .single();

        if (txTypeError) throw new Error(`Could not fetch ${type} type-ID: ${txTypeError.message}`);

        const { data: transactionData, error: transactionError } = await supabase
            .from('Transaction')
            .insert([
                {
                    TxNote: note,
                    TxAmount: txAmount,
                    CreatedDate: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
                    Wallet_id: walletId,
                    Tx_id: transactionId,
                    Tag_id: tagId,
                    TxType_id: txType.TxType_id
                }
            ])
            .select();

        if (transactionError) throw new Error('Failed to add transaction: ' + transactionError.message);

        return transactionData;
    },

    // Utility calculations
    calcRemainingBudget: (currentRemaining, txAmount) => currentRemaining - txAmount, 
    calcDailyBudget: (newRemainingBudget, daysLeft) =>
        daysLeft > 0 ? newRemainingBudget / daysLeft : newRemainingBudget,
    calcDailyGoal: (newRemainingBudget, daysLeft) =>
        daysLeft > 0 ? newRemainingBudget / daysLeft : newRemainingBudget
};
