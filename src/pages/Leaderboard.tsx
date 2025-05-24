
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import LeaderboardTable from "@/components/Leaderboard/LeaderboardTable";
import LeaderboardSkeleton from "@/components/Leaderboard/LeaderboardSkeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock user ID for demonstration (would come from auth in real app)
const CURRENT_USER_ID = "current_user";

// Define our user data structure
interface LeaderboardUser {
  id: string;
  name: string;
  averageScore: number;
  interviewsTaken: number;
  isPrivate: boolean;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardUser[]>([]);
  const [currentUserData, setCurrentUserData] = useState<LeaderboardUser | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const itemsPerPage = 10;
  
  // Generate leaderboard data from real localStorage sessions
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Get all saved sessions from localStorage
      const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
      
      if (savedSessions.length === 0) {
        // No real sessions, show empty state
        setLeaderboardData([]);
        setFilteredData([]);
        setCurrentUserData(null);
        setCurrentUserRank(null);
        setIsLoading(false);
        return;
      }
      
      // Group sessions by user (for now, all sessions are from current user)
      // In a real app, this would be grouped by actual user IDs
      const userSessions = savedSessions;
      
      // Calculate current user's stats
      const totalSessions = userSessions.length;
      const totalScore = userSessions.reduce((sum: number, session: any) => sum + (session.overallScore || 0), 0);
      const averageScore = totalSessions > 0 ? totalScore / totalSessions : 0;
      
      const currentUser: LeaderboardUser = {
        id: CURRENT_USER_ID,
        name: "You",
        averageScore: averageScore,
        interviewsTaken: totalSessions,
        isPrivate: false
      };
      
      // Create sample competitors with slightly lower scores for demonstration
      // In a real app, this would come from the database
      const competitors: LeaderboardUser[] = [];
      
      // Only add competitors if user has taken interviews
      if (totalSessions > 0) {
        const baseScore = Math.max(averageScore - 15, 60); // Competitors around 15 points lower
        
        for (let i = 1; i <= 8; i++) {
          const variance = (Math.random() - 0.5) * 20; // ±10 point variance
          const competitorScore = Math.min(Math.max(baseScore + variance, 50), 95);
          
          competitors.push({
            id: `competitor_${i}`,
            name: `User ${i}`,
            averageScore: competitorScore,
            interviewsTaken: Math.floor(Math.random() * 20) + 5,
            isPrivate: Math.random() > 0.7 // 30% chance of being private
          });
        }
      }
      
      // Combine current user with competitors
      const allUsers = [currentUser, ...competitors];
      
      // Sort by average score in descending order
      const sortedData = allUsers.sort((a, b) => b.averageScore - a.averageScore);
      
      setLeaderboardData(sortedData);
      setFilteredData(sortedData);
      
      // Find current user position
      const userRank = sortedData.findIndex(user => user.id === CURRENT_USER_ID) + 1;
      
      setCurrentUserData(currentUser);
      setCurrentUserRank(userRank);
      setIsLoading(false);
      
      if (totalSessions > 0) {
        toast({
          title: "Leaderboard updated",
          description: `Showing rankings based on ${totalSessions} interview session${totalSessions > 1 ? 's' : ''}.`,
          variant: "default",
        });
      } else {
        toast({
          title: "No interview data",
          description: "Complete some interviews to see your ranking.",
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error("Error generating leaderboard data:", error);
      setError("Failed to load leaderboard data");
      setIsLoading(false);
      toast({
        title: "Error loading data",
        description: "Could not load leaderboard data",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(leaderboardData);
    } else {
      const filtered = leaderboardData.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page on new search
    }
  }, [searchQuery, leaderboardData]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error} Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Interview Leaderboard</h1>
      
      {leaderboardData.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No Interview Data Available</h2>
          <p className="text-muted-foreground mb-6">
            Complete some interview sessions to see your ranking on the leaderboard.
          </p>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : (
            <>
              {/* Top Users */}
              <LeaderboardTable 
                users={currentPageData} 
                currentUserId={CURRENT_USER_ID}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              
              {/* Current user position (if not in top positions) */}
              {currentUserData && currentUserRank && currentUserRank > 10 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Your Position</h2>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-600 font-bold h-10 w-10 rounded-full flex items-center justify-center">
                          {currentUserRank}
                        </div>
                        <div>
                          <p className="font-semibold">{currentUserData.name} <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full ml-2">You</span></p>
                          <p className="text-sm text-gray-600">{currentUserData.interviewsTaken} interviews</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">{currentUserData.averageScore.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
