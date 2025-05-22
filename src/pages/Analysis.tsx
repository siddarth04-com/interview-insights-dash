import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchSessionData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (sessionId === 'sample-session') {
          // Return mock data for sample session
          setData({
            id: 'sample-session',
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
          });
        } else {
          // Get session from localStorage
          const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
          const session = savedSessions.find((s: any) => s.id === sessionId);
          
          if (!session) {
            setError(true);
            return;
          }
          
          // Calculate additional analysis data not stored in the session
          const questionsAttempted = session.questions.length;
          const duration = "10:00"; // Mock duration
          
          const lostMarksReasons: {[key: string]: string[]} = {};
          Object.entries(session.scores.categoryScores).forEach(([category, score]: [string, any]) => {
            // Generate reasons based on score
            const reasons = generateLostMarksReasons(category, score as number);
            lostMarksReasons[category] = reasons;
          });
          
          // Generate improvement suggestions
          const improvementSuggestions = generateImprovementSuggestions(
            session.scores.weaknesses, 
            session.scores.categoryScores
          );
          
          // Get trend data (real or mocked)
          const trendData = getTrendData(session.id);
          
          setData({
            ...session,
            questionsAttempted,
            duration,
            lostMarksReasons,
            improvementSuggestions,
            hasRecording: false, // We don't save recordings in this version
            trendData,
          });
        }
      } catch (err) {
        console.error("Error fetching session data:", err);
        setError(true);
        toast({
          title: "Error loading analysis",
          description: "There was a problem retrieving your interview session data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [sessionId]);

  // Helper function to generate reasons for lost marks
  const generateLostMarksReasons = (category: string, score: number) => {
    // Return different reasons based on category and score
    const reasons: {[key: string]: string[][]} = {
      "Subject Knowledge": [
        ["Incomplete coverage of topic", "Factual errors", "Lack of examples"],
        ["Some factual errors", "Limited examples"],
        ["Minor gaps in coverage"]
      ],
      "Analytical Thinking": [
        ["Lack of critical perspective", "Insufficient examples", "Limited analysis of complexities"],
        ["Somewhat surface-level analysis", "Could provide more context"],
        ["Minor refinements needed in argument structure"]
      ],
      "Communication Clarity": [
        ["Unclear articulation", "Disorganized structure", "Too many fillers"],
        ["Occasional lack of clarity", "Could improve organization"],
        ["Minor improvements in delivery needed"]
      ],
      "Language Accuracy": [
        ["Grammatical errors", "Limited vocabulary", "Incorrect usage of terms"],
        ["Occasional grammatical errors", "Could use more precise terminology"],
        ["Minor refinements in expression needed"]
      ],
      "Confidence & Body Language": [
        ["Poor eye contact", "Fidgeting", "Monotone delivery"],
        ["Occasional nervousness evident", "Limited vocal variety"],
        ["Minor improvements in presentation style needed"]
      ]
    };
    
    // Select reasons based on score range
    let reasonIndex = 0;
    if (score >= 75) reasonIndex = 2;
    else if (score >= 60) reasonIndex = 1;
    
    return reasons[category]?.[reasonIndex] || ["Areas for improvement not specified"];
  };
  
  // Helper function to generate improvement suggestions
  const generateImprovementSuggestions = (weaknesses: string[], categoryScores: {[key: string]: number}) => {
    const suggestions = [
      "Practice speaking with clearer articulation and organization of thoughts",
      "Work on strengthening factual knowledge in key subject areas",
      "Develop more confident body language and varied vocal delivery",
      "Improve critical thinking by analyzing issues from multiple perspectives",
      "Enhance language accuracy through regular practice and seeking feedback"
    ];
    
    // Filter based on lowest scoring categories
    return suggestions.filter((_, index) => index < 3);
  };
  
  // Helper function to get trend data
  const getTrendData = (sessionId: string) => {
    const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    
    // If we have more than 1 session, use real trend data
    if (savedSessions.length > 1) {
      return savedSessions
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((session: any) => ({
          date: session.date,
          score: session.overallScore
        }));
    }
    
    // Otherwise, generate mock trend data
    const baseDate = new Date();
    return [
      { date: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), score: 65 },
      { date: new Date(baseDate.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(), score: 68 },
      { date: new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), score: 72 },
      { date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), score: 75 },
      { date: new Date().toISOString(), score: sessionId === 'sample-session' ? 78 : 
        savedSessions.find((s: any) => s.id === sessionId)?.overallScore || 78 }
    ];
  };

  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-card rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold mt-4 mb-2">Analysis Unavailable</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't retrieve the analysis for this session. Please try again later.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Interview Analysis</h1>
      </div>
      
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
            strengths={data.scores?.strengths || data.strengths}
            weaknesses={data.scores?.weaknesses || data.weaknesses}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoryAnalysis 
            scores={data.scores?.categoryScores || data.categoryScores}
            lostMarksReasons={data.lostMarksReasons}
          />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <FeedbackSuggestions 
            suggestions={data.improvementSuggestions}
            scores={data.scores?.categoryScores || data.categoryScores}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <PersonalizedRecommendations 
            categoryScores={data.scores?.categoryScores || data.categoryScores}
            weaknesses={data.scores?.weaknesses || data.weaknesses}
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
