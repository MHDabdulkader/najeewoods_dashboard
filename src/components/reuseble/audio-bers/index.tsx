"use client";
import { useEffect, useRef, useState } from "react";

interface AudioBersProps {
  audioSource: any;
  uniqueId?: string; // unique ID per card
  children?: (params: {
    isPlaying: boolean;
    duration: string;
    progress: number;
    togglePlay: (e: any) => void;
    handleProgressBarClick: (e: React.MouseEvent) => void;
  }) => React.ReactNode;
}

export default function AudioBers({
  audioSource,
  uniqueId,
  children,
}: AudioBersProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [progress, setProgress] = useState(0);

  const audioLink = process.env.NEXT_PUBLIC_IMG_URL + audioSource;

  // 🔊 Toggle play/pause
  const togglePlay = (e: any) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // 🔈 Pause all other audios
      window.dispatchEvent(
        new CustomEvent("pauseAllAudios", { detail: uniqueId })
      );
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Update progress & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration)
        setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleLoadedMetadata = () => setDuration(formatTime(audio.duration));
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // 🧠 Listen for global pauseAllAudios event
    const handlePauseAll = (event: CustomEvent) => {
      if (event.detail !== uniqueId && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("pauseAllAudios", handlePauseAll as EventListener);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      window.removeEventListener(
        "pauseAllAudios",
        handlePauseAll as EventListener
      );
    };
  }, [uniqueId]);

  // Click to seek
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (isPlaying) {
      const bar = e.currentTarget as HTMLElement;
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * (audioRef.current?.duration || 0);
      if (audioRef.current) audioRef.current.currentTime = newTime;
    }
  };

  return (
    <>
      {children?.({
        isPlaying,
        duration,
        progress,
        togglePlay,
        handleProgressBarClick,
      })}
      <audio ref={audioRef}>
        <source src={audioLink} type="audio/mpeg" />
        <source src={audioLink} type="audio/ogg" />
      </audio>
    </>
  );
}


//  <div className="flex gap-6 lg:gap-4  2xl:gap-6 flex-wrap">
//                 {music?.data?.map((item: any, index: any) => (
//                   <AudioBers
//                     key={index}
//                     uniqueId={item._id}
//                     audioSource={item?.audio[0]}
//                   >
//                     {({
//                       isPlaying,
//                       duration,
//                       progress,
//                       togglePlay,
//                       handleProgressBarClick,
//                     }) => (
//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           updateGlobal("isDetails", item);
//                           updateGlobal("isPreview", true);
//                           // modal open song off
//                           if (isPlaying) {
//                             togglePlay(new MouseEvent("click"));
//                           }
//                         }}
//                         className="h-[190px] w-[200px] bg-card-figma rounded-md p-5 flex flex-col justify-between"
//                       >
//                         <div className="flex justify-between relative items-center menu-container">
//                           <FavIcon name="musicBers" />
//                           <div
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               updateGlobal("isShow", index);
//                             }}
//                             className="border cursor-pointer size-10 grid place-items-center rounded-full"
//                           >
//                             <EllipsisVertical />
//                           </div>
//                           {global.isShow === index && (
//                             <div className="absolute py-2 w-[100px] space-y-2 blur-bg rounded-md overflow-hidden border top-5 right-3">
//                               <h1
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   updateGlobal("isDetails",item)
//                                   updateGlobal("isUpdate", true);
//                                 }}
//                                 className="flex items-center px-2 cursor-pointer"
//                               >
//                                 <FavIcon name="edit" className="mr-2" /> Edit
//                               </h1>
//                               <h2 className="border-b my-1"></h2>
//                               <h1
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDelete(item._id);
//                                 }}
//                                 className="flex items-center px-2 cursor-pointer"
//                               >
//                                 <FavIcon name="delete" className="mr-2" />{" "}
//                                 Delete
//                               </h1>
//                             </div>
//                           )}
//                         </div>

//                         <h1 className="text-start text-secondery-figma text-lg font-medium">
//                           {duration}
//                         </h1>
//                         {/* Progress bar */}
//                         <MusicProgress
//                           onClick={(e: any) => {
//                             e.stopPropagation();
//                             handleProgressBarClick(e);
//                           }}
//                           progress={progress}
//                         />
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium flex items-center">
//                             <FavIcon name="like" className="mr-1" />{" "}
//                             {item?.likes}
//                           </span>
//                           <span onClick={togglePlay} className="cursor-pointer">
//                             {isPlaying ? (
//                               <FavIcon name="pluse" className="size-9" />
//                             ) : (
//                               <FavIcon name="play" className="size-9" />
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </AudioBers>
//                 ))}