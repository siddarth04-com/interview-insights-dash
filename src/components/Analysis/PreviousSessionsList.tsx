
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Award } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PreviousSessionsListProps {
  sessions: any[];
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
}

export default function PreviousSessionsList({
  sessions,
  currentSessionId,
  onSessionSelect,
}: PreviousSessionsListProps) {
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get score color based on value
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No interview sessions found. Complete an interview to see your history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Session History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const isCurrentSession = session.id === currentSessionId;
            
            return (
              <div
                key={session.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isCurrentSession
                    ? "border-primary/50 bg-primary/5"
                    : "hover:bg-accent cursor-pointer"
                }`}
                onClick={() => !isCurrentSession && onSessionSelect(session.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {session.examType} Interview
                      {isCurrentSession && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>
                          {format(
                            parseISO(session.date),
                            "dd MMM yyyy"
                          )}
                        </span>
                      </div>
                      {session.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{session.duration}</span>
                        </div>
                      )}
                      {session.questions && (
                        <div>
                          {session.questions.length} questions
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span
                      className={`text-xl font-semibold ${getScoreColorClass(
                        session.overallScore
                      )}`}
                    >
                      {session.overallScore}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
