"use client";
import { AnalyticsCharts } from "@/components/common/chart/earning-chart";
import PostingCart from "@/components/common/chart/posting-chart";
import ShadowBox from "@/components/common/shadow-box";
import WapperBox from "@/components/reuseble/wapper-box";
import FavIcon from "@/icon/favIcon";
import { useGetDashboardQuery } from "@/redux/api/dashboardApi";
import React from "react";

export default function RootHome() {
  const { data: statistics } = useGetDashboardQuery({});

  const dataStatistics = [
    {
      title: "Total Earnings",
      value: statistics?.data?.total_earning,
      icon: "earningsIcon",
    },
    {
      title: "Total Vibes",
      value: statistics?.data?.total_vibes,
      icon: "videIcon",
    },
    {
      title: "Total Music's",
      value: statistics?.data?.total_audio,
      icon: "musicIcon",
    },
    {
      title: "Total Podcasts",
      value: statistics?.data?.total_podcast,
      icon: "podcastsIcon",
    },
  ];
  return (
    <div>
      <ShadowBox className="md:-top-26">
        <div>
          <h1 className="text-2xl 2xl:text-3xl font-semibold">
            Dashboard Overview
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {dataStatistics.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 space-y-2 border text-white relative overflow-hidden"
              >
                {/* Music Icon */}
                <div className="size-12 grid place-items-center rounded-xl bgOne">
                  <FavIcon className="size-6" name={item.icon as any} />
                </div>
                <p className="font-medium text-xl">{item.title}</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-semibold">
                    {item.value || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ShadowBox>
      <WapperBox>
        <div className="pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
            <div className="col-span-2">
              <h1 className="text-2xl font-semibold mb-4">
                Posting Preference
              </h1>
              <PostingCart data={statistics?.data?.posting_preference} />
            </div>
            <div className="col-span-3">
              <h1 className="text-2xl font-semibold mb-4">
                Earning Statistics
              </h1>
              <AnalyticsCharts data={statistics?.data?.earning_per_day} />
            </div>
          </div>
        </div>
      </WapperBox>
    </div>
  );
}
