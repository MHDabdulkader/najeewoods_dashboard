import React from "react";
import logo from "@/assets/logo.svg";
import Image from "next/image";

export default function HeroSec() {
  return (
    <div className="container relative z-10 max-w-4xl mx-auto px-6">
      <div className="flex flex-col items-center text-center animate-slide-up">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl py-2 px-6 mb-4">
       <Image src={logo} alt="Logo" width={150} height={150} className="w-20 h-25 overflow-visible!" />
        </div>

        <h1 className="font-heading text-4xl md:text-5xl  font-bold mb-4">
          <span className="gradient-text">Privacy Policy</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
          Your privacy is important to us. This policy outlines how we collect,
          use, and protect your personal information.
        </p>
      </div>
    </div>
  );
}
