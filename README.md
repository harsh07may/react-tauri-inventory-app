# ShopManager Pro (Inventory + Billing App)

A fast, lightweight, strictly desktop-first counter-sale POS system built with **React**, **Tauri v2**, and **SQLite**.

## Features

### Product & Inventory Management
- Real-time inventory tracking with threshold-based "Low Stock" indicators.
- Seamless creation and updating of products by Name, SKU, Purchase Price, and Sale Price.
- Search-optimized, virtualized data tables rendering smoothly without lag.

### Billing Screen & Point of Sale
- Highly responsive POS interface optimized for speed.
- Smart Cart: Auto-calculates dynamic subtotals, applied taxes, and displays grand totals.
- Fast checkout: Mapped `Ctrl + Enter` to securely finalize transactions instantly.
- Transactions log directly into the local SQLite database, writing to `invoices`, `invoice_items`, scaling down `products.quantity_in_stock`, and recording `stock_movements` in one safe ACID transaction.

### Print Preview & Native PDF Export
- Generates custom thermal receipt designs.
- Native `window.print()` support specifically optimized using `@media print` CSS.
- Export receipts instantly as PDF documents. Interfaces directly with Tauri's native OS file save dialogs via `jspdf` and `html-to-image`.

### Security, Authentication & Settings
- Guarded `ProtectedRoute` architecture ensuring only logged-in users reach the dashboard.
- Sessions are securely managed and persisted globally via Zustand.
- Dedicated `Shop Settings` page enabling shop owners to store global dynamic configurations (Shop Name, Tax GST Number, standard VAT/Tax defaults).
- Hardened Production Builds: Developer tools and Context Menus are fundamentally blocked upon compilation. 

---

## Architecture

Built adhering to a raw MVP design philosophy:
- **No Heavy Abstractions**: Explicit raw parameterized SQL queries using `@tauri-apps/plugin-sql` backend over cumbersome ORMs. 
- **Local-First Capabilities**: SQLite backend runs entirely offline.
- **Native Tauri Migrations**: Schema creation seamlessly runs against versions via the Rust `_tauri_migrations` struct ensuring safety. 
- **Desktop Standard**: Hardcoded configurations scale elegantly at `1366x768` minimum sizes. 

## Running Locally

### Prerequisites
Make sure you have Node.js, `pnpm`, and the Rust toolchain installed for Tauri v2 development. 

```bash
# 1. Clone the repository and navigate inside
cd inventory-app

# 2. Install Javascript dependencies
pnpm install

# 3. Launch the desktop development window
pnpm tauri dev
```

### Production Build
```bash
pnpm tauri build
```
This generates the standalone desktop installer with pre-stripped dev tools and right-click protections.
