
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { LineChart, Activity, Award } from "lucide-react";
import AnalyticsCard from "@/components/Dashboard/AnalyticsCard";
import ScoreTrendChart from "@/components/Dashboard/ScoreTrendChart";
import LoadingState from "@/components/Dashboard/LoadingState";
import { useToast } from "@/components/ui/use-toast";

interface ScoreData {
  date: string;
  score: number;
}

interface UserAnalytics {
  interviewsTaken: number;
  averageScore: number;
  scoreTrend: ScoreData[];
}

const Index = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you'd get the userId from authentication
    const userId = "currentUserId";
    
    const unsubscribe = onSnapshot(
      doc(db, "Analytics", userId),
      (doc) => {
        if (doc.exists()) {
          setAnalytics(doc.data() as UserAnalytics);
          setLoading(false);
        } else {
          setError("No data found for this user");
          setLoading(false);
          toast({
            title: "Data not found",
            description: "We couldn't find your analytics data.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error("Error fetching analytics:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive",
        });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">
            {error} Please check your connection and try again.
          </p>
        </div>
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
      </div>

      <ScoreTrendChart
        data={analytics?.scoreTrend || []}
        isLoading={loading}
      />
    </div>
  );
};

export default Index;
