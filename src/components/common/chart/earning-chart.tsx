"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { BarChart, Bar, CartesianGrid, XAxis } from "recharts"

// Assuming you have dynamic data passed from backend (renamed from `earningsData` to `data`)
const chartConfig = {
  views: {
    label: "Page Views",
  },
  earnings: {
    label: "Earnings",
  },
} satisfies ChartConfig

// Pick which metric to display: "views" or "earnings"
const activeChart: keyof typeof chartConfig = "earnings"

export function AnalyticsCharts({ data }: { data: { day: number; value: number }[] }) {
  // Mapping backend data to the required structure (with "day" and dynamic "value" for earnings/views)
  const mappedData = data?.map(item => ({
    day: `${item.day}`,  // Formatting day
    [activeChart]: item.value,  // Using dynamic metric (views or earnings)
  }))

  return (
    <div className="border rounded-md p-4">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={mappedData}  // Use the mapped dynamic data
          margin={{ left: 12, right: 12 }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF8787" />   {/* Top */}
              <stop offset="100%" stopColor="#8578B4" /> {/* Bottom */}
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey={activeChart}
                labelFormatter={(value) => `Day ${value}`}
              />
            }
          />
          <Bar
            dataKey={activeChart}
            fill="url(#barGradient)"   // Apply gradient here
            radius={[6, 6, 0, 0]}     // Rounded top corners
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
