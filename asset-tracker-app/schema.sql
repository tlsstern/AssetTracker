DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS assets CASCADE;

CREATE TABLE assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    type TEXT NOT NULL,
    quantity DECIMAL(12, 4),
    symbol TEXT,
    currency TEXT DEFAULT 'CHF',
    account_type TEXT,
    metal_type TEXT,
    income DECIMAL(12, 2),
    destination_account UUID,
    card_limit DECIMAL(12, 2),
    last_price_update TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    transaction_type VARCHAR(10) NOT NULL DEFAULT 'expense',
    account_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_transaction_type CHECK (transaction_type IN ('income', 'expense')),
    CONSTRAINT check_recurring_frequency CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly') OR recurring_frequency IS NULL)
);

CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assets"
ON assets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets"
ON assets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
ON assets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
ON assets FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON transactions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON transactions FOR DELETE
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_assets
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_transactions
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

COMMENT ON COLUMN assets.symbol IS 'Stock ticker symbol or cryptocurrency ID for price tracking';
COMMENT ON COLUMN assets.last_price_update IS 'Timestamp of last automatic price update';
COMMENT ON COLUMN assets.card_limit IS 'Credit limit for card type assets';
COMMENT ON COLUMN assets.metal_type IS 'Type of precious metal (XAU, XAG, XPT, XPD)';
COMMENT ON COLUMN assets.income IS 'Monthly income amount for salary assets';
COMMENT ON COLUMN assets.destination_account IS 'Bank account ID where salary is deposited';