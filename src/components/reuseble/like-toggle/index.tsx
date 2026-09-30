import FavIcon from "@/icon/favIcon";
import React from "react";

interface LikeToggleProps {
  likes: any;
}

export default function LikeToggle({likes }: LikeToggleProps) {
  return (
    <div className="border rounded-md h-10 flex space-x-2 items-center px-2">
      <span>
        {" "}
        <FavIcon name="like" />
      </span>
      <span>{likes}</span>
    </div>
  );
}
