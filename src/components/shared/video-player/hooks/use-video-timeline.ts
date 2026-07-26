import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import type { TimelineEntry, TimelineMarker } from "../video-player.types";
import { STORAGE_PREFIX } from "../video-player.constants";

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const loadFromStorage = (key: string): TimelineEntry[] | null => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as TimelineEntry[];
  } catch { /* ignore */ }
  return null;
};

const saveToStorage = (key: string, data: TimelineEntry[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
};

const activeIndexBinary = (entries: TimelineEntry[], currentTime: number): number => {
  let lo = 0;
  let hi = entries.length - 1;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (entries[mid].time <= currentTime) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
};

const isTimeBuffered = (video: HTMLVideoElement, time: number): boolean => {
  for (let i = 0; i < video.buffered.length; i++) {
    if (time >= video.buffered.start(i) && time <= video.buffered.end(i)) return true;
  }
  return false;
};

type UseVideoTimelineArgs = {
  markers?: TimelineMarker[];
  storageKey?: string;
};

export const useVideoTimeline = ({ markers, storageKey }: UseVideoTimelineArgs) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [userNotes, setUserNotes] = useState<TimelineEntry[]>(() => {
    if (!storageKey) return [];
    const saved = loadFromStorage(STORAGE_PREFIX + storageKey);
    return saved ?? [];
  });

  // combine markers (read-only) + user notes (editable)
  const timeline = useMemo<TimelineEntry[]>(() => {
    const markerEntries: TimelineEntry[] = (markers ?? []).map((m) => ({
      time: m.time,
      label: m.label,
      note: "",
    }));
    const merged = [...markerEntries, ...userNotes].sort((a, b) => a.time - b.time);
    return merged;
  }, [markers, userNotes]);

  // rAF time tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tick = () => {
      setCurrentTime(video.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // persist user notes
  useEffect(() => {
    if (storageKey) {
      saveToStorage(STORAGE_PREFIX + storageKey, userNotes);
    }
  }, [userNotes, storageKey]);

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    if (isTimeBuffered(video, time)) {
      video.currentTime = time;
      video.play();
      setSeeking(false);
    } else {
      setSeeking(true);
      const onProgress = () => {
        if (isTimeBuffered(video, time)) {
          video.currentTime = time;
          video.play();
          setSeeking(false);
          video.removeEventListener("progress", onProgress);
        }
      };
      video.addEventListener("progress", onProgress);
    }
  }, []);

  const captureCurrentTime = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const t = Math.floor(video.currentTime);
    setUserNotes((prev) => {
      const next = [...prev, { time: t, label: formatTime(t), note: "" }].sort((a, b) => a.time - b.time);
      return next;
    });
  }, []);

  const updateNote = useCallback((time: number, note: string) => {
    setUserNotes((prev) => prev.map((e) => e.time === time ? { ...e, note } : e));
  }, []);

  const removeEntry = useCallback((time: number) => {
    setUserNotes((prev) => prev.filter((e) => e.time !== time));
  }, []);

  const ai = activeIndexBinary(timeline, currentTime);

  return {
    videoRef,
    currentTime,
    seeking,
    seekTo,
    captureCurrentTime,
    editingIndex,
    setEditingIndex,
    updateNote,
    removeEntry,
    timeline,
    activeIndex: ai,
  };
};
