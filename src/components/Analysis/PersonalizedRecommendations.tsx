import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Loader2, Key } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonalizedRecommendationsProps {
  categoryScores: {
    [key: string]: number;
  };
  weaknesses: string[];
  overallScore: number;
  examType: string;
}

export default function PersonalizedRecommendations({
  categoryScores,
  weaknesses,
  overallScore,
  examType,
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [isRecommendationsGenerated, setIsRecommendationsGenerated] = useState(false);

  const generateRecommendations = async () => {
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key first");
      setShowApiInput(true);
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for OpenAI
      const prompt = `
        As an expert interview coach for ${examType} exams, provide 5 personalized recommendations for 
        a candidate with the following performance metrics:
        
        Overall Score: ${overallScore}/100
        
        Category Scores:
        ${Object.entries(categoryScores)
          .map(([category, score]) => `- ${category}: ${score}/100`)
          .join("\n")}
        
        Main Weaknesses:
        ${weaknesses.map(weakness => `- ${weakness}`).join("\n")}
        
        Give specific, actionable advice that addresses their weaknesses and helps them 
        improve their performance in future ${examType} interviews. Format each recommendation
        as a bullet point.
      `;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert interview coach for civil services and military examinations."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Error generating recommendations");
      }

      // Parse the response to extract the recommendations
      const content = data.choices[0]?.message?.content;
      if (content) {
        // Extract bullet points
        const bulletPoints = content
          .split(/\n+/) // Split by newlines
          .filter(line => line.match(/^[•\-\*]\s+/)) // Keep only bullet points
          .map(line => line.replace(/^[•\-\*]\s+/, '')); // Remove bullet point markers
        
        setRecommendations(bulletPoints.length > 0 ? bulletPoints : [content]);
        setIsRecommendationsGenerated(true);
      } else {
        throw new Error("Could not extract recommendations from the response");
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const toggleApiInput = () => {
    setShowApiInput(!showApiInput);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          Personalized Learning Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isRecommendationsGenerated ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Get personalized recommendations based on your interview performance to help you improve.
            </p>
            
            {showApiInput && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Enter your OpenAI API key</div>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground">
                  Your API key is only used for this request and is not stored.
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={generateRecommendations} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Recommendations"}
              </Button>
              
              {!showApiInput && (
                <Button 
                  variant="outline" 
                  onClick={toggleApiInput}
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Add API Key
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="bg-muted/60 p-4 rounded-lg">
                <div className="flex gap-3">
                  <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <p>{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {isRecommendationsGenerated && (
        <CardFooter className="bg-muted/50 pt-4">
          <Alert variant="default" className="w-full">
            <AlertDescription>
              These recommendations are generated using AI and should be considered alongside your own study plan.
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
