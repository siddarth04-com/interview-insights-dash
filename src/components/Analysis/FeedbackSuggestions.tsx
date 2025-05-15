
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowUpCircle } from "lucide-react";

interface FeedbackSuggestionsProps {
  suggestions: string[];
  scores: {
    [key: string]: number;
  };
}

export default function FeedbackSuggestions({
  suggestions,
  scores,
}: FeedbackSuggestionsProps) {
  // Find the lowest scoring categories
  const lowestCategories = Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([category]) => category);

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            AI-Generated Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white dark:bg-background rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/50 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 dark:text-amber-400 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p>{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowUpCircle className="h-5 w-5 mr-2 text-primary" />
            Focus Areas for Maximum Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Based on your performance, we recommend focusing on improving these specific areas:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowestCategories.map((category, index) => (
              <div key={index} className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{category}</h3>
                <p className="text-sm text-muted-foreground">
                  {getFocusAreaDescription(category)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get focus area descriptions
function getFocusAreaDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    "Subject Knowledge": "Deepen your understanding of core subjects through targeted study. Focus on facts, examples, and contemporary relevance.",
    "Analytical Thinking": "Practice breaking down complex topics and making logical connections. Work on building arguments with proper evidence.",
    "Communication Clarity": "Focus on organizing your thoughts before speaking. Use clear structure with introduction, key points, and conclusion.",
    "Language Accuracy": "Improve grammatical accuracy and vocabulary breadth. Read widely and practice articulating complex ideas.",
    "Confidence & Body Language": "Practice maintaining eye contact and speaking with varied intonation. Reduce fidgeting and nervous gestures."
  };
  
  return descriptions[category] || "Focus on systematic improvement through regular practice and feedback.";
}
