"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import FavIcon from "@/icon/favIcon";

type MusicPlayerProps = {
  audioSource: string;
  custom?: boolean;
  idx?: number;
};

export default function MusicPlayer({
  audioSource,
  custom = true,
  idx,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const audioLink = custom
    ? process.env.NEXT_PUBLIC_IMG_URL + audioSource
    : audioSource;

  /** 🎵 Toggle play / pause */
  const togglePlay = (e: any) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // 🔇 Pause all others globally (but don’t reset)
      window.dispatchEvent(new CustomEvent("pauseAllAudios", { detail: idx }));
      audio.play();
      setIsPlaying(true);
    }
  };

  /** 🔊 Toggle mute / unmute */
  const toggleMute = (e: any) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  /** 🧠 Listen for global pause events (no reset) */
  useEffect(() => {
    const handlePauseAll = (event: CustomEvent) => {
      if (event.detail !== idx && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        // ❌ Don't reset time here — only pause
      }
    };

    window.addEventListener("pauseAllAudios", handlePauseAll as EventListener);
    return () => {
      window.removeEventListener(
        "pauseAllAudios",
        handlePauseAll as EventListener
      );
    };
  }, [idx]);

  /** 🕒 Update time and duration */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  /** ⏱ Format mm:ss */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /** 📈 Progress bar percent */
  const progress = duration ? (currentTime / duration) * 100 : 0;

  /** 🧭 Seek in audio */
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (!isPlaying) return;
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newTime = (clickPosition / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  /** 🧹 When audio ends, reset play state but keep currentTime at duration */
  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full mx-auto">
      <div
        ref={progressBarRef}
        className="relative w-full rounded-full border px-2 py-[6px] bg-gray-800 shadow-lg overflow-hidden cursor-pointer"
        onClick={handleProgressBarClick}
      >
        {/* 🔵 Progress */}
        <div
          className="absolute top-0 left-0 h-full bgOne transition-all duration-300"
          style={{ width: `${progress}%` }}
        />

        <div className="relative flex items-center justify-between">
          {/* ▶️ Play / Pause */}
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="sm"
            type="button"
            className="h-8 w-8 p-0 cursor-pointer text-white hover:bg-white/20 rounded-full mr-4"
          >
            {isPlaying ? (
              <FavIcon name="pluse" className="size-9" />
            ) : (
              <FavIcon className="size-9" name="play" />
            )}
          </Button>

          {/* 🎶 Waveform icon */}
          <FavIcon name="musicBers1" />

          {/* ⏱ Time */}
          <span className="text-sm text-secondery-figma select-none ml-3">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* 🔈 Volume */}
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            type="button"
            className="h-8 w-8 p-0 hover:bg-transparent hover:text-[#b7b8b9] text-[#b7b8b9] rounded-full ml-4"
          >
            {isMuted ? (
              <VolumeX className="size-5" />
            ) : (
              <Volume2 className="size-5" />
            )}
          </Button>

          {/* 🎧 Hidden audio */}
          <audio ref={audioRef} onEnded={handleEnded}>
            <source src={audioLink} type="audio/mpeg" />
            <source src={audioLink} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}
