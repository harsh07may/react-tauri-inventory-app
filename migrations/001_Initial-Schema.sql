create table if not exists shop_settings (
  setting_key text primary key,
  setting_value text not null
);

create table if not exists users (
id text primary key,
username text unique not null,
password_hash text not null,
role text check (role in ('admin', 'staff')) not null,
created_at timestamp default current_timestamp
);

create table if not exists products (
id text primary key,
name text not null,
sku text unique,
purchase_price real not null,
selling_price real not null,
quantity_in_stock int not null check (quantity_in_stock >= 0),
low_stock_threshold int not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp
);

create table if not exists invoices (
id text primary key,
invoice_number text unique not null,
subtotal real not null,
tax_percent real not null,
tax_amount real not null,
total_amount real not null,
payment_method text check (payment_method in ('cash', 'card', 'upi')) not null,
created_by text not null,
created_at timestamp default current_timestamp,
foreign key (created_by) references users (id)
);

create table if not exists invoice_items (
id text primary key,
invoice_id text not null,
product_id text not null,
quantity int not null check (quantity > 0),
unit_price real not null,
line_total real not null,
foreign key (invoice_id) references invoices (id) on delete cascade,
foreign key (product_id) references products (id) on delete restrict
);

create table if not exists stock_movements (
id text primary key,
product_id text not null,
change_quantity int not null,
reason text check (
  reason in ('sale', 'restock', 'manual_adjustment')
) not null,
reference_invoice_id text,
created_by text not null,
created_at timestamp default current_timestamp,
foreign key (product_id) references products (id),
foreign key (reference_invoice_id) references invoices (id),
foreign key (created_by) references users (id)
);

create index if not exists idx_products_name on products (name);
create index if not exists idx_invoices_invoice_number on invoices (invoice_number);
create index if not exists idx_invoices_created_at on invoices (created_at);
create index if not exists idx_invoice_items_invoice_id on invoice_items (invoice_id);
create index if not exists idx_stock_movements_product_id on stock_movements (product_id);