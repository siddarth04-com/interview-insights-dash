
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionDisplayProps {
  question: string;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <Card className="bg-accent">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Question:</h3>
        <p>{question}</p>
      </CardContent>
    </Card>
  );
}
