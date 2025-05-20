
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionDisplayProps {
  question: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export default function QuestionDisplay({ 
  question, 
  questionNumber, 
  totalQuestions 
}: QuestionDisplayProps) {
  return (
    <Card className="bg-accent">
      <CardContent className="p-4">
        {questionNumber && totalQuestions && (
          <div className="text-sm text-muted-foreground mb-1">
            Question {questionNumber} of {totalQuestions}
          </div>
        )}
        <h3 className="font-semibold mb-2">Question:</h3>
        <p className="text-lg">{question}</p>
      </CardContent>
    </Card>
  );
}
