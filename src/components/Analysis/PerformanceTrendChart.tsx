
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";

interface TrendData {
  date: string;
  score: number;
}

interface PerformanceTrendChartProps {
  data: TrendData[];
}

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    try {
      const date = parseISO(label);
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium text-sm">
            Date: {format(date, "dd MMM yyyy")}
          </p>
          <p className="text-primary font-bold">
            Score: {payload[0].value?.toFixed(1)}
          </p>
        </div>
      );
    } catch (error) {
      // Fallback for invalid dates
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium text-sm">Date: {label}</p>
          <p className="text-primary font-bold">
            Score: {payload[0].value?.toFixed(1)}
          </p>
        </div>
      );
    }
  }
  return null;
};

export default function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
  // Format the timestamps to readable dates for X-axis
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "dd/MM"),
  }));

  // Calculate overall trend
  const firstScore = data[0]?.score ?? 0;
  const lastScore = data[data.length - 1]?.score ?? 0;
  const scoreDifference = lastScore - firstScore;
  const trendPercentage = firstScore !== 0 ? (scoreDifference / firstScore) * 100 : 0;
  
  const isImproving = scoreDifference > 0;
  const trendDescription = isImproving 
    ? `Improving (↑${trendPercentage.toFixed(1)}% since first session)`
    : `Declining (↓${Math.abs(trendPercentage).toFixed(1)}% since first session)`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Performance Trend</CardTitle>
        <div className={`text-sm font-medium ${isImproving ? 'text-green-500' : 'text-red-500'}`}>
          {trendDescription}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[
                  Math.max(0, Math.min(...data.map(d => d.score)) - 10),
                  Math.min(100, Math.max(...data.map(d => d.score)) + 10)
                ]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          {data.length > 1 ? (
            <p>
              Your performance has {isImproving ? 'improved' : 'decreased'} from {firstScore} to {lastScore} points 
              over the last {data.length} sessions.
              {isImproving ? ' Keep up the good work!' : ' Focus on your improvement areas to boost your scores.'}
            </p>
          ) : (
            <p>Complete more interview sessions to see your performance trend over time.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
