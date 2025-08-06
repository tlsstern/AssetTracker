DO $$
DECLARE
    uid UUID := '0810af60-39d5-47e5-bc63-b04510455ae5';
    bank_account_1 UUID;
    bank_account_2 UUID;
    bank_account_3 UUID;
BEGIN
    DELETE FROM transactions WHERE transactions.user_id = uid;
    DELETE FROM assets WHERE assets.user_id = uid;

    INSERT INTO assets (user_id, name, value, type, currency, account_type)
    VALUES (uid, 'UBS Checking Account', 15750.50, 'bankAccount', 'CHF', 'Checking')
    RETURNING id INTO bank_account_1;

    INSERT INTO assets (user_id, name, value, type, currency, account_type)
    VALUES (uid, 'PostFinance Savings', 45200.00, 'bankAccount', 'CHF', 'Savings')
    RETURNING id INTO bank_account_2;

    INSERT INTO assets (user_id, name, value, type, currency, account_type)
    VALUES (uid, 'Revolut Account', 2300.75, 'bankAccount', 'CHF', 'Checking')
    RETURNING id INTO bank_account_3;

    INSERT INTO assets (user_id, name, value, type, quantity)
    VALUES 
    (uid, 'Apple Inc.', 5670.00, 'stock', 30),
    (uid, 'Microsoft Corp.', 8940.50, 'stock', 25),
    (uid, 'Nestle SA', 3200.00, 'stock', 40),
    (uid, 'Novartis AG', 4500.00, 'stock', 50),
    (uid, 'Tesla Inc.', 6789.00, 'stock', 15);

    INSERT INTO assets (user_id, name, value, type, quantity)
    VALUES 
    (uid, 'Bitcoin', 12500.00, 'crypto', 0.25),
    (uid, 'Ethereum', 4200.00, 'crypto', 2.5),
    (uid, 'Cardano', 890.00, 'crypto', 1500);

    INSERT INTO assets (user_id, name, value, type, quantity, metal_type)
    VALUES 
    (uid, 'Gold', 5800.00, 'preciousMetal', 100, 'XAU'),
    (uid, 'Silver', 1200.00, 'preciousMetal', 1500, 'XAG');

    INSERT INTO assets (user_id, name, value, type, income, destination_account)
    VALUES 
    (uid, 'Software Engineer', 8500.00, 'salary', 8500.00, bank_account_1),
    (uid, 'Freelance Projects', 2000.00, 'salary', 2000.00, bank_account_3);

    INSERT INTO transactions (user_id, name, value, category, date, transaction_type, account_id, is_recurring, recurring_frequency)
    VALUES 
    (uid, 'Monthly Salary', 8500.00, 'Salary', CURRENT_DATE - INTERVAL '2 months', 'income', bank_account_1, true, 'monthly'),
    (uid, 'Monthly Salary', 8500.00, 'Salary', CURRENT_DATE - INTERVAL '1 month', 'income', bank_account_1, true, 'monthly'),
    (uid, 'Monthly Salary', 8500.00, 'Salary', CURRENT_DATE, 'income', bank_account_1, true, 'monthly'),
    (uid, 'Website Project', 3500.00, 'Freelance', CURRENT_DATE - INTERVAL '45 days', 'income', bank_account_3, false, NULL),
    (uid, 'App Development', 5000.00, 'Freelance', CURRENT_DATE - INTERVAL '20 days', 'income', bank_account_3, false, NULL),
    (uid, 'Birthday Gift', 500.00, 'Gift', CURRENT_DATE - INTERVAL '35 days', 'income', bank_account_2, false, NULL),
    (uid, 'Stock Dividends', 234.50, 'Investment', CURRENT_DATE - INTERVAL '15 days', 'income', bank_account_1, false, NULL),
    (uid, 'Tax Refund', 1200.00, 'Refund', CURRENT_DATE - INTERVAL '10 days', 'income', bank_account_1, false, NULL),
    (uid, 'Apartment Rent', 2200.00, 'Housing', CURRENT_DATE - INTERVAL '2 months' - INTERVAL '5 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Apartment Rent', 2200.00, 'Housing', CURRENT_DATE - INTERVAL '1 month' - INTERVAL '5 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Apartment Rent', 2200.00, 'Housing', CURRENT_DATE - INTERVAL '5 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Netflix Subscription', 18.90, 'Entertainment', CURRENT_DATE - INTERVAL '60 days', 'expense', bank_account_3, true, 'monthly'),
    (uid, 'Netflix Subscription', 18.90, 'Entertainment', CURRENT_DATE - INTERVAL '30 days', 'expense', bank_account_3, true, 'monthly'),
    (uid, 'Netflix Subscription', 18.90, 'Entertainment', CURRENT_DATE, 'expense', bank_account_3, true, 'monthly'),
    (uid, 'Spotify Premium', 12.95, 'Entertainment', CURRENT_DATE - INTERVAL '55 days', 'expense', bank_account_3, true, 'monthly'),
    (uid, 'Spotify Premium', 12.95, 'Entertainment', CURRENT_DATE - INTERVAL '25 days', 'expense', bank_account_3, true, 'monthly'),
    (uid, 'Gym Membership', 89.00, 'Healthcare', CURRENT_DATE - INTERVAL '50 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Gym Membership', 89.00, 'Healthcare', CURRENT_DATE - INTERVAL '20 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Migros Groceries', 156.30, 'Food', CURRENT_DATE - INTERVAL '65 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Coop Shopping', 89.50, 'Food', CURRENT_DATE - INTERVAL '62 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Restaurant - Hiltl', 65.00, 'Food', CURRENT_DATE - INTERVAL '58 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Migros Groceries', 142.20, 'Food', CURRENT_DATE - INTERVAL '51 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Takeaway Pizza', 28.50, 'Food', CURRENT_DATE - INTERVAL '48 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Coop Shopping', 98.40, 'Food', CURRENT_DATE - INTERVAL '41 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Restaurant - Italian', 120.00, 'Food', CURRENT_DATE - INTERVAL '35 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Migros Groceries', 167.80, 'Food', CURRENT_DATE - INTERVAL '28 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Coffee Shop', 12.50, 'Food', CURRENT_DATE - INTERVAL '25 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Coop Shopping', 134.60, 'Food', CURRENT_DATE - INTERVAL '18 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Restaurant - Sushi', 95.00, 'Food', CURRENT_DATE - INTERVAL '12 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Migros Groceries', 178.90, 'Food', CURRENT_DATE - INTERVAL '5 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Starbucks', 8.50, 'Food', CURRENT_DATE - INTERVAL '2 days', 'expense', bank_account_3, false, NULL),
    (uid, 'SBB Monthly Pass', 185.00, 'Transport', CURRENT_DATE - INTERVAL '60 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'SBB Monthly Pass', 185.00, 'Transport', CURRENT_DATE - INTERVAL '30 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'SBB Monthly Pass', 185.00, 'Transport', CURRENT_DATE, 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Uber Ride', 24.50, 'Transport', CURRENT_DATE - INTERVAL '42 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Gas Station', 85.00, 'Transport', CURRENT_DATE - INTERVAL '22 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Parking Fee', 15.00, 'Transport', CURRENT_DATE - INTERVAL '8 days', 'expense', bank_account_3, false, NULL),
    (uid, 'H&M Clothes', 129.90, 'Shopping', CURRENT_DATE - INTERVAL '55 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Electronics - Headphones', 249.00, 'Shopping', CURRENT_DATE - INTERVAL '40 days', 'expense', bank_account_1, false, NULL),
    (uid, 'IKEA Furniture', 456.00, 'Shopping', CURRENT_DATE - INTERVAL '32 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Amazon Order', 67.80, 'Shopping', CURRENT_DATE - INTERVAL '19 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Zara Jacket', 189.00, 'Shopping', CURRENT_DATE - INTERVAL '9 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Health Insurance', 412.50, 'Healthcare', CURRENT_DATE - INTERVAL '65 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Health Insurance', 412.50, 'Healthcare', CURRENT_DATE - INTERVAL '35 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Health Insurance', 412.50, 'Healthcare', CURRENT_DATE - INTERVAL '5 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Pharmacy', 45.60, 'Healthcare', CURRENT_DATE - INTERVAL '28 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Doctor Visit', 150.00, 'Healthcare', CURRENT_DATE - INTERVAL '15 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Cinema Tickets', 38.00, 'Entertainment', CURRENT_DATE - INTERVAL '48 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Concert Tickets', 125.00, 'Entertainment', CURRENT_DATE - INTERVAL '30 days', 'expense', bank_account_3, false, NULL),
    (uid, 'PlayStation Game', 69.90, 'Entertainment', CURRENT_DATE - INTERVAL '21 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Book Store', 34.50, 'Entertainment', CURRENT_DATE - INTERVAL '14 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Museum Entry', 25.00, 'Entertainment', CURRENT_DATE - INTERVAL '3 days', 'expense', bank_account_3, false, NULL),
    (uid, 'Phone Bill', 79.00, 'Other', CURRENT_DATE - INTERVAL '58 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Phone Bill', 79.00, 'Other', CURRENT_DATE - INTERVAL '28 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Internet Bill', 69.00, 'Other', CURRENT_DATE - INTERVAL '45 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Internet Bill', 69.00, 'Other', CURRENT_DATE - INTERVAL '15 days', 'expense', bank_account_1, true, 'monthly'),
    (uid, 'Bank Fees', 12.00, 'Other', CURRENT_DATE - INTERVAL '30 days', 'expense', bank_account_1, false, NULL),
    (uid, 'Gift for Friend', 85.00, 'Other', CURRENT_DATE - INTERVAL '24 days', 'expense', bank_account_3, false, NULL);
END $$;