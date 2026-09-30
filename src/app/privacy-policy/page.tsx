"use client";
import CopyRight from "@/components/common/home/copy-right";
import HeroSec from "@/components/common/home/hero-sec";
import PrivacyBox from "@/components/common/home/privacy";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br backdrop-blur-3xl from-purple-900 via-purple-800 to-pink-500/80 pt-10">
      <HeroSec />
      <PrivacyBox className="my-10" />
      <CopyRight />
    </div>
  );
}
