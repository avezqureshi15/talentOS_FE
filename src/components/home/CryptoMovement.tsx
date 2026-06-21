import type { CryptoData } from "./Home.types";
import "./Home.css";

function SparkLine({
  color = "#ef4444",
  points = [],
  width = 120,
  height = 40,
}: {
  color?: string;
  points: number[];
  width?: number;
  height?: number;
}) {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pts = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="crypto-sparkline">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function generateSparkData(trend: "down" | "up" = "down", len = 40): number[] {
  let val = 50 + Math.random() * 10;
  return Array.from({ length: len }, () => {
    val += (Math.random() - (trend === "down" ? 0.55 : 0.45)) * 3;
    return Math.max(10, Math.min(90, val));
  });
}

export default function CryptoMovement({ cryptos }: { cryptos: CryptoData[] }) {
  const sparkData = cryptos.map(() => generateSparkData("down"));

  return (
    <section>
      <h2 className="home-section-title">Crypto Movement</h2>
      <div className="crypto-grid">
        {cryptos.map((c, i) => (
          <div key={c.sym} className="crypto-card">
            <div className="crypto-card-top">
              <span className="crypto-card-name">{c.name}</span>
              <span className={`crypto-card-change crypto-card-change--${c.down ? "down" : "up"}`}>
                {c.down ? "↘" : "↗"} {c.change}
              </span>
            </div>
            <div className="crypto-card-price">
              {c.price}{"  "}
              <span className={`crypto-card-delta--${c.down ? "down" : "up"}`}>{c.delta}</span>
            </div>
            <SparkLine
              color={c.down ? "#f87171" : "#4ade80"}
              points={sparkData[i]}
              width={110}
              height={36}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
