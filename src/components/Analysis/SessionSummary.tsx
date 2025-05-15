
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface SessionSummaryProps {
  overallScore: number;
  questionsAttempted: number;
  duration: string;
  strengths: string[];
  weaknesses: string[];
}

export default function SessionSummary({
  overallScore,
  questionsAttempted,
  duration,
  strengths,
  weaknesses,
}: SessionSummaryProps) {
  // Determine score color based on value
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Score */}
            <div className="bg-card/50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Overall Score</div>
              <div className={`text-4xl font-bold ${getScoreColorClass(overallScore)}`}>
                {overallScore}/100
              </div>
            </div>
            
            {/* Questions Attempted */}
            <div className="bg-card/50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Questions Attempted</div>
              <div className="text-4xl font-bold">{questionsAttempted}</div>
            </div>
            
            {/* Duration */}
            <div className="bg-card/50 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Session Duration</div>
              <div className="text-4xl font-bold flex items-center gap-2">
                <Clock className="h-6 w-6" />
                {duration}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Strengths */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No strengths identified yet.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Weaknesses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No areas for improvement identified yet.</p>
          )}
        </CardContent>
      </Card>
      
      <Alert className="md:col-span-2">
        <AlertTitle>Helpful Tip</AlertTitle>
        <AlertDescription>
          Review your strengths and weaknesses carefully. Focus on improving one area at a time for the best results in your next practice session.
        </AlertDescription>
      </Alert>
    </div>
  );
}
