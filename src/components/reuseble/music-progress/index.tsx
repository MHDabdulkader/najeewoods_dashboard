import React from "react";

export default function MusicProgress({ onClick, progress = 0 }: any) {
  return (
    <div
      onClick={(e)=>onClick(e)}
      className="h-5 cursor-pointer flex flex-col items-center justify-center"
    >
      <div className="bg-secondery-figma relative w-full h-px">
        <span
          style={{ width: `${progress}%` }}
          className="bg-white h-px absolute inset-y-0 left-0"
        ></span>
      </div>
    </div>
  );
}
