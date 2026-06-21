export interface CryptoData {
  name: string;
  sym: string;
  price: string;
  change: string;
  delta: string;
  down: boolean;
}

export interface NewsItem {
  title: string;
  body: string;
}

export interface WatchlistItem {
  name: string;
  ticker: string;
  price: string;
  change: string;
  down: boolean;
  color: string;
}

export interface PredictionRow {
  price: string;
  prob: string;
  change: string;
  up: boolean;
}

export interface NavTab {
  label: string;
  value: string;
}
