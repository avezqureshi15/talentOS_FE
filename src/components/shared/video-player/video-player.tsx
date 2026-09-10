import { useVideoTimeline } from "./hooks/use-video-timeline";
import type { VideoPlayerProps } from "./video-player.types";
import "./video-player.css";

const VideoPlayer = ({ videoSrc, markers, storageKey, timelineHeight = 460 }: VideoPlayerProps) => {
  const {
    videoRef, currentTime, seeking, seekTo, captureCurrentTime,
    editingIndex, setEditingIndex, updateNote, removeEntry,
    timeline, activeIndex: ai,
  } = useVideoTimeline({ markers, storageKey });

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="vp-root">
      <div className="vp-layout">
        <div className="vp-video-section">
          <video ref={videoRef} controls preload="metadata">
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="vp-toolbar">
            <span className="vp-toolbar-label">Current:</span>
            <span className="vp-toolbar-time">{fmtTime(currentTime)}</span>
            <button className="vp-btn vp-btn--add" onClick={captureCurrentTime} type="button">
              + Add
            </button>
          </div>
        </div>
        <div className="vp-timeline-section">
          <div className="vp-timeline-header">
            Timeline
            {seeking && <span className="vp-seeking">loading…</span>}
          </div>
          <div className="vp-list-wrapper" style={{ maxHeight: timelineHeight }}>
            <div className="vp-list" style={{ height: timelineHeight }}>
              {timeline.map((entry, i) => {
                const isMarker = !!(markers && markers.some((m) => m.time === entry.time));
                const isActive = i === ai;
                const isEditing = editingIndex === i;
                return (
                  <div
                    key={`${entry.time}-${i}`}
                    className={`vp-item${isActive ? " vp-item--active" : ""}${isMarker ? " vp-item--marker" : ""}`}
                    onClick={() => seekTo(entry.time)}
                  >
                    <span className="vp-time">{entry.label}</span>
                    {isMarker ? (
                      <span className="vp-note vp-note--marker">{entry.note || "Section marker"}</span>
                    ) : isEditing ? (
                      <input
                        className="vp-note-input"
                        value={entry.note}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateNote(entry.time, e.target.value)}
                        onBlur={() => setEditingIndex(null)}
                        onKeyDown={(e) => { if (e.key === "Enter") setEditingIndex(null); }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="vp-note"
                        onDoubleClick={(e) => { e.stopPropagation(); setEditingIndex(i); }}
                      >
                        {entry.note || <span className="vp-note--empty">Add note</span>}
                      </span>
                    )}
                    {!isMarker && (
                      <button
                        className="vp-remove"
                        onClick={(e) => { e.stopPropagation(); removeEntry(entry.time); }}
                        type="button"
                        title="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
