
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

interface CategoryAnalysisProps {
  scores: {
    [key: string]: number;
  };
  lostMarksReasons: {
    [key: string]: string[];
  };
}

export default function CategoryAnalysis({
  scores,
  lostMarksReasons,
}: CategoryAnalysisProps) {
  // Prepare data for chart
  const chartData = Object.entries(scores).map(([category, score]) => ({
    category,
    score,
    color: getColorForScore(score),
  }));

  // Get color based on score
  function getColorForScore(score: number) {
    if (score >= 80) return "#22c55e"; // green-500
    if (score >= 70) return "#f59e0b"; // amber-500
    if (score >= 60) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ChartContainer
              config={{
                green: { color: "#22c55e" },
                amber: { color: "#f59e0b" },
                orange: { color: "#f97316" },
                red: { color: "#ef4444" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickCount={6}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent hideIndicator formatter={(value) => [`${value}/100`, 'Score']} />
                    }
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(scores).map(([category, score]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{category}</span>
                <span className={`px-2 py-1 rounded text-white text-sm font-medium bg-[${getColorForScore(score)}]`} style={{ backgroundColor: getColorForScore(score) }}>
                  {score}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium mb-2">Areas to Improve:</h4>
              {lostMarksReasons[category]?.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {lostMarksReasons[category].map((reason, index) => (
                    <li key={index} className="text-muted-foreground">{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific issues identified.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
