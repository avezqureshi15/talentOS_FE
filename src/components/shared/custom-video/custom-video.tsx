import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, PictureInPicture2 } from "lucide-react";
import type { CustomVideoHandle, CustomVideoProps } from "./custom-video.types";
import "./custom-video.css";

const SPEEDS = [0.5, 1, 1.5, 2];

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const seekFromEvent = (track: HTMLElement, clientX: number, video: HTMLVideoElement) => {
  const rect = track.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  video.currentTime = pct * video.duration;
};

const volumeFromEvent = (track: HTMLElement, clientX: number, video: HTMLVideoElement) => {
  const rect = track.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  video.volume = pct;
  video.muted = pct === 0;
  return pct;
};

const CustomVideo = forwardRef<CustomVideoHandle, CustomVideoProps>(({ src }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seekTrackRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsActive, setControlsActive] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const seekingRef = useRef(false);

  useImperativeHandle(ref, () => ({
    seek: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
    get video() { return videoRef.current; },
  }), []);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => { if (!seekingRef.current) setCurrentTime(el.currentTime); };
    const onMeta = () => setDuration(el.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);
    const onRate = () => setPlaybackRate(el.playbackRate);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    el.addEventListener("ratechange", onRate);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("ratechange", onRate);
    };
  }, []);

  /* ─── fullscreen change ─── */
  useEffect(() => {
    const fn = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  /* ─── keyboard ─── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); video.paused ? video.play() : video.pause(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); }
      if (e.key === "ArrowRight") { e.preventDefault(); video.currentTime = Math.min(video.duration, video.currentTime + 5); }
      if (e.key === "ArrowUp") { e.preventDefault(); const v = Math.min(1, video.volume + 0.1); video.volume = v; video.muted = false; setVolume(v); setMuted(false); }
      if (e.key === "ArrowDown") { e.preventDefault(); const v = Math.max(0, video.volume - 0.1); video.volume = v; if (v === 0) video.muted = true; setVolume(v); setMuted(v === 0); }
      if (e.key === "f") { e.preventDefault(); containerRef.current?.requestFullscreen(); }
      if (e.key === "m") { e.preventDefault(); video.muted = !video.muted; setMuted(video.muted); }
    };
    el.addEventListener("keydown", onKey);
    el.tabIndex = 0;
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  /* ─── auto-hide ─── */
  const showControls = useCallback(() => {
    setControlsActive(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (playing) setControlsActive(false); }, 2500);
  }, [playing]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const overlayVisible = !playing || controlsActive;

  /* ─── play toggle ─── */
  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.paused ? el.play() : el.pause();
  }, []);

  /* ─── seek ─── */
  const handleSeekDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSeeking(true);
    seekingRef.current = true;
    const video = videoRef.current;
    if (!video || !seekTrackRef.current) return;
    seekFromEvent(seekTrackRef.current, e.clientX, video);
    const onMove = (ev: MouseEvent) => seekFromEvent(seekTrackRef.current!, ev.clientX, video);
    const onUp = () => {
      setIsSeeking(false);
      seekingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isSeeking) return;
    const video = videoRef.current;
    if (!video || !seekTrackRef.current) return;
    seekFromEvent(seekTrackRef.current, e.clientX, video);
  }, [isSeeking]);

  /* ─── volume ─── */
  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = volumeFromEvent(e.currentTarget, e.clientX, video);
    setVolume(v);
    setMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  /* ─── fullscreen ─── */
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await containerRef.current.requestFullscreen();
    }
  }, []);

  /* ─── PiP ─── */
  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch { /* not supported */ }
  }, []);

  /* ─── speed ─── */
  const cycleSpeed = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const idx = SPEEDS.indexOf(video.playbackRate);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    video.playbackRate = next;
    setPlaybackRate(next);
  }, []);

  /* ─── render ─── */
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volPct = muted ? 0 : volume * 100;

  return (
    <div
      ref={containerRef}
      className="cv-container"
      onMouseMove={showControls}
      onMouseLeave={() => { if (playing) setControlsActive(false); }}
    >
      <video ref={videoRef} className="cv-video" src={src} preload="metadata" />

      {!overlayVisible && (
        <button className="cv-center-play" onClick={togglePlay} aria-label="Play">
          <span className="cv-center-play-inner">
            <Play className="cv-center-play-icon" />
          </span>
        </button>
      )}

      <div className={`cv-controls${overlayVisible ? " cv-controls--active" : ""}`}>
        <button className="cv-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause className="cv-btn-icon" /> : <Play className="cv-btn-icon" />}
        </button>

        <div
          className={`cv-seek-wrap${isSeeking ? " cv-seek-wrap--dragging" : ""}`}
          onMouseDown={handleSeekDown}
          onClick={handleSeekClick}
        >
          <div ref={seekTrackRef} className="cv-seek-track">
            <div className="cv-seek-fill" style={{ width: `${pct}%` }} />
            <div className="cv-seek-thumb" style={{ left: `${pct}%` }} />
          </div>
        </div>

        <span className="cv-time">{formatTime(currentTime)} / {formatTime(duration)}</span>

        <div className="cv-volume-wrap">
          <button className="cv-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="cv-btn-icon" /> : <Volume2 className="cv-btn-icon" />}
          </button>
          <div className={`cv-volume-slider${overlayVisible ? " cv-volume-slider--open" : ""}`}>
            <div className="cv-volume-track" onClick={handleVolumeClick}>
              <div className="cv-volume-fill" style={{ width: `${volPct}%` }} />
              <div className="cv-volume-thumb" style={{ left: `${volPct}%` }} />
            </div>
          </div>
        </div>

        <div className="cv-right">
          <button className="cv-speed" onClick={cycleSpeed} aria-label="Playback speed">
            {playbackRate}x
          </button>
          <button className="cv-btn" onClick={togglePiP} aria-label="Picture in picture">
            <PictureInPicture2 className="cv-btn-icon" />
          </button>
          <button className="cv-btn" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {fullscreen ? <Minimize className="cv-btn-icon" /> : <Maximize className="cv-btn-icon" />}
          </button>
        </div>
      </div>
    </div>
  );
});

CustomVideo.displayName = "CustomVideo";
export default CustomVideo;