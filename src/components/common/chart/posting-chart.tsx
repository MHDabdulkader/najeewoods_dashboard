"use client";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { helpers } from "@/lib";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// Updated PostingCart Component to accept dynamic data
export default function PostingCart({ data = [] }: any) {
  // Map the backend data to the chart data format
  const chartData = data.map((item: any) => ({
    day: item.day.charAt(0).toUpperCase() + item.day.slice(1), // Capitalize first letter of the day
    vibe: item.vibes,
    music: item.audio,
    podcast: item.podcast,
  }));

  const chartConfig = {
    vibe: {
      label: "Vibe",
      color: "#6A5ACD", // soft purple
    },
    music: {
      label: "Music",
      color: "#FF6B6B", // coral red
    },
    podcast: {
      label: "Podcast",
      color: "#4FC3F7", // sky blue
    },
  } satisfies ChartConfig;

  return (
    <div className="border rounded-md p-4">
      <ChartContainer
        className="aspect-auto h-[280px] w-full"
        config={chartConfig}
      >
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} stroke="#333" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          {/* Music */}
          <Area
            dataKey="music"
            type="monotone"
            fill="url(#musicGradient)"
            stroke={chartConfig.music.color}
          />
          {/* Podcast */}
          <Area
            dataKey="podcast"
            type="monotone"
            fill="url(#podcastGradient)"
            stroke={chartConfig.podcast.color}
          />
          {/* Vibe */}
          <Area
            dataKey="vibe"
            type="monotone"
            fill="url(#vibeGradient)"
            stroke={chartConfig.vibe.color}
          />

          {/* Gradient defs */}
          <defs>
            <linearGradient id="vibeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartConfig.vibe.color}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={chartConfig.vibe.color}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="musicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartConfig.music.color}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={chartConfig.music.color}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="podcastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartConfig.podcast.color}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={chartConfig.podcast.color}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
        </AreaChart>
      </ChartContainer>

      <div className="flex items-center justify-center gap-8">
        {/* Vibe */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: chartConfig.vibe.color }}
          />
          <span className="text-white text-sm font-medium">Vibe</span>
        </div>

        {/* Music */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: chartConfig.music.color }}
          />
          <span className="text-white text-sm font-medium">Music</span>
        </div>

        {/* Podcast */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: chartConfig.podcast.color }}
          />
          <span className="text-white text-sm font-medium">Podcast</span>
        </div>
      </div>
    </div>
  );
}
