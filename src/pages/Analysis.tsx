
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

import SessionSummary from "@/components/Analysis/SessionSummary";
import CategoryAnalysis from "@/components/Analysis/CategoryAnalysis";
import FeedbackSuggestions from "@/components/Analysis/FeedbackSuggestions";
import VideoReplay from "@/components/Analysis/VideoReplay";
import PerformanceTrendChart from "@/components/Analysis/PerformanceTrendChart";
import PersonalizedRecommendations from "@/components/Analysis/PersonalizedRecommendations";
import AnalysisLoading from "@/components/Analysis/AnalysisLoading";

// Mock fetch function (replace with actual Firebase fetch)
const fetchSessionData = async (sessionId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    id: sessionId,
    date: new Date().toISOString(),
    examType: "UPSC",
    overallScore: 78,
    questionsAttempted: 5,
    duration: "12:35", // MM:SS
    strengths: ["Subject Knowledge", "Analytical Thinking"],
    weaknesses: ["Communication Clarity", "Language Accuracy"],
    categoryScores: {
      "Subject Knowledge": 85,
      "Analytical Thinking": 80,
      "Communication Clarity": 65,
      "Language Accuracy": 72,
      "Confidence & Body Language": 68
    },
    lostMarksReasons: {
      "Subject Knowledge": ["Incomplete coverage of topic", "Factual errors"],
      "Analytical Thinking": ["Lack of critical perspective", "Insufficient examples"],
      "Communication Clarity": ["Unclear articulation", "Disorganized structure", "Too many fillers"],
      "Language Accuracy": ["Grammatical errors", "Limited vocabulary"],
      "Confidence & Body Language": ["Poor eye contact", "Fidgeting", "Monotone delivery"]
    },
    improvementSuggestions: [
      "Practice speaking with clearer articulation and organization of thoughts",
      "Work on strengthening factual knowledge in key subject areas",
      "Develop more confident body language and varied vocal delivery"
    ],
    hasRecording: true,
    recordingUrl: "https://example.com/mock-recording.mp4",
    trendData: [
      { date: "2025-04-15T10:00:00Z", score: 65 },
      { date: "2025-04-22T14:30:00Z", score: 68 },
      { date: "2025-04-30T09:15:00Z", score: 72 },
      { date: "2025-05-07T16:45:00Z", score: 75 },
      { date: "2025-05-15T11:20:00Z", score: 78 }
    ]
  };
};

export default function Analysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [activeTab, setActiveTab] = useState("summary");
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sessionAnalysis', sessionId],
    queryFn: () => fetchSessionData(sessionId || ''),
    retry: 1,
    enabled: Boolean(sessionId)
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading analysis",
        description: "There was a problem retrieving your interview session data.",
        variant: "destructive",
      });
    }
  }, [isError]);

  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-card rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold mt-4 mb-2">Analysis Unavailable</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't retrieve the analysis for this session. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Interview Analysis</h1>
      <p className="text-muted-foreground mb-8">
        {data.examType} Interview Session - {new Date(data.date).toLocaleDateString()}
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          {data.hasRecording && (
            <TabsTrigger value="replay">Replay</TabsTrigger>
          )}
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <SessionSummary 
            overallScore={data.overallScore}
            questionsAttempted={data.questionsAttempted}
            duration={data.duration}
            strengths={data.strengths}
            weaknesses={data.weaknesses}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoryAnalysis 
            scores={data.categoryScores}
            lostMarksReasons={data.lostMarksReasons}
          />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <FeedbackSuggestions 
            suggestions={data.improvementSuggestions}
            scores={data.categoryScores}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <PersonalizedRecommendations 
            categoryScores={data.categoryScores}
            weaknesses={data.weaknesses}
            overallScore={data.overallScore}
            examType={data.examType}
          />
        </TabsContent>
        
        {data.hasRecording && (
          <TabsContent value="replay" className="space-y-4">
            <VideoReplay recordingUrl={data.recordingUrl} />
          </TabsContent>
        )}
        
        <TabsContent value="trends" className="space-y-4">
          <PerformanceTrendChart data={data.trendData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
