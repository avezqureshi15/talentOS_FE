import "./media-player.css";

const MediaPlayer = () => {
  return (
    <div className="mp-card">
      <div className="mp-placeholder">
        <div className="mp-placeholder-icon"><i className="bx bx-play" /></div>
      </div>
      <div className="mp-controls">
        <span className="mp-timestamp">00:00 / 15:30</span>
        <button className="mp-speed-btn">1x</button>
        <button className="mp-volume-btn"><i className="bx bx-volume-full" /></button>
        <button className="mp-fullscreen-btn"><i className="bx bx-fullscreen" /></button>
      </div>
    </div>
  );
};

export default MediaPlayer;
