import type { CryptoData, NewsItem, WatchlistItem, PredictionRow, NavTab } from "./Home.types";

export const CRYPTOS: CryptoData[] = [
  { name: "Bitcoin", sym: "BTC", price: "$63,424.29", change: "-3.40%", delta: "-$2,233.60", down: true },
  { name: "Ethereum", sym: "ETH", price: "$1,769.24", change: "-2.65%", delta: "-$48.14", down: true },
  { name: "Solana", sym: "SOL", price: "$69.33", change: "-4.28%", delta: "-$3.10", down: true },
  { name: "Coin 50", sym: "C50", price: "$242.61", change: "-3.42%", delta: "-$8.59", down: true },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    title: "Bitcoin Plunges to 4-Month Low, Erases All Post-War Gains",
    body: "Bitcoin (BTC) dropped nearly 4% to $63,407, hitting a near four-month low after dipping as low as $61,311 intraday. The sell-off has completely erased all gains accumulated since the onset of the US-Iran conflict, with BTC now trading almost 50% below its all-time high from October 2025.",
  },
  { title: "Strategy's Bitcoin Sale Shatters 'Never Sell' Confidence", body: "" },
  { title: "Ethereum and Altcoins Follow Bitcoin Sharply Lower", body: "" },
];

export const WATCHLIST: WatchlistItem[] = [
  { name: "ICICI Lombard Gen...", ticker: "ICICIGI · NSE", price: "₹1,732.9", change: "-0.45%", down: true, color: "#f97316" },
  { name: "Tata Technologies ...", ticker: "TATATECH · NSE", price: "₹748.35", change: "+2.37%", down: false, color: "#1d4ed8" },
  { name: "Infosys Limited", ticker: "INFY · NSE", price: "₹1,201.3", change: "-1.74%", down: true, color: "#6366f1" },
  { name: "Reliance Industrie...", ticker: "RELIANCE · BSE", price: "₹1,304.2", change: "-0.67%", down: true, color: "#0ea5e9" },
];

export const PREDICTIONS: PredictionRow[] = [
  { price: "62,000", prob: "100.0%", change: "+3.1%", up: true },
  { price: "56,000", prob: "100.0%", change: "0.0%", up: false },
  { price: "58,000", prob: "100.0%", change: "0.0%", up: false },
];

export const NAV_TABS: NavTab[] = [
  { label: "India Markets ▾", value: "India Markets" },
  { label: "Crypto", value: "Crypto" },
  { label: "Earnings", value: "Earnings" },
  { label: "Predictions", value: "Predictions" },
  { label: "Screener", value: "Screener" },
  { label: "Watchlist", value: "Watchlist" },
];

export const SIDEBAR_NAV_ITEMS = [
  { icon: "🖥", label: "Computer" },
  { icon: "⬡", label: "Spaces" },
  { icon: "◈", label: "Artifacts" },
  { icon: "✦", label: "Customize" },
  { icon: "↺", label: "History" },
];

export const SIDEBAR_NEW_LABEL = "New";
export const SIDEBAR_SIGN_IN = "Sign In";

export const TOPBAR_TITLE = "Perplexity Finance";
export const SEARCH_PLACEHOLDER = "Search for stocks, crypto, and more...";
export const SHARE_LABEL = "↗ Share";
export const MARKET_SUMMARY_TITLE = "Market Summary";
export const TIMESTAMP_TEXT = "Updated 55 seconds ago";
export const CRYPTO_TITLE = "Crypto Movement";
export const WATCHLIST_TITLE = "Create Watchlist";
export const PREDICTION_TITLE = "Prediction Markets";
export const SENTIMENT_LABEL = "Bearish Sentiment";
export const SENTIMENT_SUBTITLE = "Crypto · 4 Jun 2026, IST";
export const CHAT_PLACEHOLDER = "Ask anything about crypto";
export const SEARCH_BTN_LABEL = "🔍 Search ▾";
export const COMPUTER_BTN_LABEL = "🖥 Computer";
