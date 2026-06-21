import { useState } from "react";
import type { NavTab } from "./Home.types";
import {
  CRYPTOS,
  NEWS_ITEMS,
  WATCHLIST,
  PREDICTIONS,
  NAV_TABS,
  TOPBAR_TITLE,
  SEARCH_PLACEHOLDER,
  SHARE_LABEL,
  SENTIMENT_LABEL,
  SENTIMENT_SUBTITLE,
  CHAT_PLACEHOLDER,
  SEARCH_BTN_LABEL,
  COMPUTER_BTN_LABEL,
} from "./Home.data";
import Sidebar from "./Sidebar";
import CryptoMovement from "./CryptoMovement";
import MarketSummary from "./MarketSummary";
import WatchlistSection from "./WatchlistSection";
import PredictionMarkets from "./PredictionMarkets";
import "./Home.css";

export default function Home() {
  const [activeNav, setActiveNav] = useState("Crypto");
  const [openNews, setOpenNews] = useState(0);
  const [chatInput, setChatInput] = useState("");

  const handleNewsToggle = (index: number) => {
    setOpenNews(openNews === index ? -1 : index);
  };

  return (
    <div className="home-root">
      <Sidebar />

      <main className="home-main">
        <header className="home-topbar">
          <span className="home-topbar-title">{TOPBAR_TITLE}</span>
          <div className="home-search-box">
            <span>🔍</span>
            {SEARCH_PLACEHOLDER}
          </div>
          <button className="home-share-btn">{SHARE_LABEL}</button>
        </header>

        <div className="home-nav-tabs">
          {NAV_TABS.map((tab: NavTab) => {
            const isActive = activeNav === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveNav(tab.value)}
                className={`home-nav-tab ${isActive ? "home-nav-tab--active" : "home-nav-tab--inactive"}`}
              >
                {tab.value === "India Markets" && <span>🇮🇳</span>}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="home-content">
          <div className="home-content-left">
            <CryptoMovement cryptos={CRYPTOS} />

            <MarketSummary
              items={NEWS_ITEMS}
              openIndex={openNews}
              onToggle={handleNewsToggle}
            />

            <div className="home-chat-card">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={CHAT_PLACEHOLDER}
                className="home-chat-input"
              />
              <div className="home-chat-actions">
                <button className="home-chat-action-btn home-chat-action-btn--icon">＋</button>
                <button className="home-chat-action-btn">{SEARCH_BTN_LABEL}</button>
                <button className="home-chat-action-btn">{COMPUTER_BTN_LABEL}</button>
                <div className="home-chat-send">
                  <button
                    className={`home-chat-send-btn ${chatInput ? "home-chat-send-btn--active" : ""}`}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="home-right-sidebar">
            <div className="sentiment-card">
              <div className="sentiment-bars">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="sentiment-bar"
                    style={{ '--sentiment-opacity': 0.7 + i * 0.03 } as React.CSSProperties}
                  />
                ))}
              </div>
              <div>
                <div className="sentiment-label">{SENTIMENT_LABEL}</div>
                <div className="sentiment-date">{SENTIMENT_SUBTITLE}</div>
              </div>
            </div>

            <WatchlistSection items={WATCHLIST} />

            <PredictionMarkets rows={PREDICTIONS} />
          </aside>
        </div>
      </main>
    </div>
  );
}
