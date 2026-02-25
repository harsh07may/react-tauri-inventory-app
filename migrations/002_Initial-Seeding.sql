INSERT OR IGNORE INTO users (id, username, password_hash, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin', 'admin', 'admin');

INSERT OR IGNORE INTO products (id, name, sku, purchase_price, selling_price, quantity_in_stock, low_stock_threshold) VALUES 
('22222222-2222-2222-2222-222222222221', 'Wireless Mouse', 'WM-001', 15.00, 25.00, 50, 10),
('22222222-2222-2222-2222-222222222222', 'Mechanical Keyboard', 'MK-001', 45.00, 75.00, 30, 5),
('22222222-2222-2222-2222-222222222223', 'USB-C Cable', 'UC-001', 5.00, 12.00, 100, 20);

INSERT OR IGNORE INTO shop_settings (setting_key, setting_value) VALUES 
('shop_name', 'City General Store'),
('tax_number', '22AAAAA0000A1Z5'),
('default_tax_percent', '18');