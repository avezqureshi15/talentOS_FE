export type SparkLineProps = {
  color?: string;
  points: number[];
  width?: number;
  height?: number;
};

export type CryptoMovementProps = {
  cryptos: CryptoData[];
};

export type CryptoData = {
  sym: string;
  name: string;
  price: string;
  change: string;
  delta: string;
  down: boolean;
};
