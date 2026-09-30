"use client";
import React, { useRef, ChangeEvent, ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

interface AudioUploaderProps {
  onFileSelect: (files: File[]) => void;
  children: ReactNode;
  className?: string;
}

const AudioMulUpload: React.FC<AudioUploaderProps> = ({
  onFileSelect,
  children,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFileSelect(filesArray); // Pass selected files to the parent component
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div onClick={handleClick} className={className} style={{ cursor: "pointer" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="audio/*"
        multiple
      />
      {children}
    </div>
  );
};

export default AudioMulUpload;