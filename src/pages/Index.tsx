
import { useState, useEffect } from "react";
import { Activity, Award, LineChart } from "lucide-react";
import AnalyticsCard from "@/components/Dashboard/AnalyticsCard";
import ScoreTrendChart from "@/components/Dashboard/ScoreTrendChart";
import LoadingState from "@/components/Dashboard/LoadingState";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScoreData {
  date: string;
  score: number;
}

interface UserAnalytics {
  interviewsTaken: number;
  averageScore: number;
  scoreTrend: ScoreData[];
}

// Mock data for demonstration
const mockAnalytics: UserAnalytics = {
  interviewsTaken: 12,
  averageScore: 78.5,
  scoreTrend: [
    { date: "2025-01-05", score: 65 },
    { date: "2025-01-15", score: 70 },
    { date: "2025-02-01", score: 68 },
    { date: "2025-02-15", score: 72 },
    { date: "2025-03-01", score: 75 },
    { date: "2025-03-15", score: 80 },
    { date: "2025-04-01", score: 78 },
    { date: "2025-04-15", score: 82 },
    { date: "2025-05-01", score: 85 },
    { date: "2025-05-10", score: 79 }
  ]
};

const Index = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      try {
        // Use mock data
        setAnalytics(mockAnalytics);
        setLoading(false);
        
        toast({
          title: "Data loaded successfully",
          description: "Using demonstration data for preview.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error setting up mock data:", error);
        setError("Failed to load demonstration data");
        setLoading(false);
        toast({
          title: "Error loading data",
          description: "Could not load demonstration data",
          variant: "destructive",
        });
      }
    }, 1500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Interview Performance</h1>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Interview Performance</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error} Please refresh the page to try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Interview Performance</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <AnalyticsCard
          title="Interviews Taken"
          value={analytics?.interviewsTaken || 0}
          icon={<Activity className="h-5 w-5" />}
          isLoading={loading}
        />
        <AnalyticsCard
          title="Average Score"
          value={
            analytics?.averageScore
              ? `${analytics.averageScore.toFixed(1)}%`
              : "0%"
          }
          icon={<Award className="h-5 w-5" />}
          isLoading={loading}
        />
        <AnalyticsCard
          title="Latest Score"
          value={
            analytics?.scoreTrend && analytics.scoreTrend.length > 0
              ? `${analytics.scoreTrend[analytics.scoreTrend.length - 1].score}%`
              : "N/A"
          }
          icon={<LineChart className="h-5 w-5" />}
          isLoading={loading}
        />
      </div>

      <ScoreTrendChart
        data={analytics?.scoreTrend || []}
        isLoading={loading}
      />
    </div>
  );
};

export default Index;
