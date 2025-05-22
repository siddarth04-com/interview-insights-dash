
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";

import SessionSummary from "@/components/Analysis/SessionSummary";
import CategoryAnalysis from "@/components/Analysis/CategoryAnalysis";
import FeedbackSuggestions from "@/components/Analysis/FeedbackSuggestions";
import VideoReplay from "@/components/Analysis/VideoReplay";
import PerformanceTrendChart from "@/components/Analysis/PerformanceTrendChart";
import PersonalizedRecommendations from "@/components/Analysis/PersonalizedRecommendations";
import AnalysisLoading from "@/components/Analysis/AnalysisLoading";
import PreviousSessionsList from "@/components/Analysis/PreviousSessionsList";

export default function Analysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchSessionData = async () => {
      setIsLoading(true);
      try {
        // Get all saved sessions
        const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
        setAllSessions(savedSessions);
        
        if (sessionId === 'sample-session' && savedSessions.length === 0) {
          // Return mock data only for sample session when no real sessions exist
          setData({
            id: 'sample-session',
            date: new Date().toISOString(),
            examType: "UPSC",
            overallScore: 78,
            questionsAttempted: 5,
            duration: "12:35", // MM:SS
            scores: {
              strengths: ["Subject Knowledge", "Analytical Thinking"],
              weaknesses: ["Communication Clarity", "Language Accuracy"],
              categoryScores: {
                "Subject Knowledge": 85,
                "Analytical Thinking": 80,
                "Communication Clarity": 65,
                "Language Accuracy": 72,
                "Confidence & Body Language": 68
              }
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
            hasRecording: false,
            trendData: generateSampleTrendData()
          });
        } else {
          // Get specific session from localStorage
          const session = savedSessions.find((s: any) => s.id === sessionId);
          
          if (!session) {
            setError(true);
            return;
          }
          
          // Calculate additional analysis data
          const questionsAttempted = session.questions?.length || 0;
          const responsesGiven = session.responses?.filter((r: string) => r && r.trim().length > 0).length || 0;
          
          // Calculate duration (if not available)
          const duration = session.duration || "10:00"; // Default if not recorded
          
          // Generate lost marks reasons if not already available
          const lostMarksReasons: {[key: string]: string[]} = session.lostMarksReasons || {};
          
          if (!session.lostMarksReasons) {
            Object.entries(session.scores?.categoryScores || {}).forEach(([category, score]: [string, any]) => {
              // Generate reasons based on score
              lostMarksReasons[category] = generateLostMarksReasons(category, score as number);
            });
          }
          
          // Generate improvement suggestions if not available
          const improvementSuggestions = session.improvementSuggestions || 
            generateImprovementSuggestions(
              session.scores?.weaknesses || [], 
              session.scores?.categoryScores || {}
            );
          
          // Get trend data from all sessions
          const trendData = getTrendData(savedSessions);
          
          setData({
            ...session,
            questionsAttempted,
            responsesGiven,
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
        toast("Error loading analysis", {
          description: "There was a problem retrieving your interview session data.",
          className: "bg-destructive text-destructive-foreground",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [sessionId]);

  // Helper function to generate mock trend data for sample session
  const generateSampleTrendData = () => {
    const baseDate = new Date();
    return [
      { date: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), score: 65 },
      { date: new Date(baseDate.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(), score: 68 },
      { date: new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), score: 72 },
      { date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), score: 75 },
      { date: baseDate.toISOString(), score: 78 }
    ];
  };

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
    // Suggestions mapped to categories
    const categoryBasedSuggestions: {[key: string]: string[]} = {
      "Subject Knowledge": [
        "Review core conceptual frameworks related to your exam syllabus",
        "Practice explaining complex topics in simple language to demonstrate deep understanding",
        "Create a structured study plan focusing on your weaker subject areas"
      ],
      "Analytical Thinking": [
        "Practice analyzing issues from multiple perspectives before forming conclusions",
        "Work on connecting theoretical concepts to real-world applications",
        "Develop the ability to structure complex arguments logically"
      ],
      "Communication Clarity": [
        "Practice organizing your thoughts before speaking using a clear structure",
        "Record yourself answering questions and analyze your speech patterns",
        "Reduce filler words by practicing deliberate pauses instead"
      ],
      "Language Accuracy": [
        "Read high-quality publications daily to improve vocabulary and expression",
        "Practice speaking with proper sentence structure and grammar",
        "Work on using precise terminology relevant to your field"
      ],
      "Confidence & Body Language": [
        "Practice maintaining eye contact while speaking in front of a mirror",
        "Work on varying your vocal tone and pace for more engaging delivery",
        "Practice controlled hand gestures to emphasize key points"
      ]
    };
    
    // Get weakest areas
    const sortedScores = Object.entries(categoryScores)
      .sort(([, scoreA], [, scoreB]) => (scoreA as number) - (scoreB as number))
      .slice(0, 3)
      .map(([category]) => category);
    
    // Combine weaknesses from scores and explicit weaknesses
    const allWeakAreas = Array.from(new Set([...sortedScores, ...weaknesses]));
    
    // Get suggestions based on weak areas
    const suggestions: string[] = [];
    allWeakAreas.forEach(area => {
      const areaSpecificSuggestions = categoryBasedSuggestions[area] || [];
      // Add one suggestion per area to avoid too many suggestions
      if (areaSpecificSuggestions.length > 0) {
        suggestions.push(areaSpecificSuggestions[Math.floor(Math.random() * areaSpecificSuggestions.length)]);
      }
    });
    
    // Return top 3 unique suggestions
    return Array.from(new Set(suggestions)).slice(0, 3);
  };
  
  // Helper function to get trend data
  const getTrendData = (allSessions: any[]) => {
    if (allSessions.length <= 1) {
      return sessionId === 'sample-session' ? generateSampleTrendData() : [{
        date: new Date().toISOString(),
        score: allSessions[0]?.overallScore || 70
      }];
    }
    
    // Sort sessions by date
    return allSessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(session => ({
        date: session.date,
        score: session.overallScore
      }));
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
      
      <p className="text-muted-foreground mb-6">
        {data.examType} Interview Session - {new Date(data.date).toLocaleDateString()}
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          {data.hasRecording && (
            <TabsTrigger value="replay">Replay</TabsTrigger>
          )}
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <SessionSummary 
            overallScore={data.overallScore}
            questionsAttempted={data.questionsAttempted}
            duration={data.duration}
            strengths={data.scores?.strengths || data.strengths || []}
            weaknesses={data.scores?.weaknesses || data.weaknesses || []}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoryAnalysis 
            scores={data.scores?.categoryScores || data.categoryScores || {}}
            lostMarksReasons={data.lostMarksReasons || {}}
          />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <FeedbackSuggestions 
            suggestions={data.improvementSuggestions || []}
            scores={data.scores?.categoryScores || data.categoryScores || {}}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <PersonalizedRecommendations 
            categoryScores={data.scores?.categoryScores || data.categoryScores || {}}
            weaknesses={data.scores?.weaknesses || data.weaknesses || []}
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
          <PerformanceTrendChart data={data.trendData || []} />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <PreviousSessionsList 
            sessions={allSessions} 
            currentSessionId={sessionId || ''}
            onSessionSelect={(id: string) => navigate(`/analysis/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
