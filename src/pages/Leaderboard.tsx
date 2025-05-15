
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import LeaderboardTable from "@/components/Leaderboard/LeaderboardTable";
import LeaderboardSkeleton from "@/components/Leaderboard/LeaderboardSkeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock user ID for demonstration (would come from auth in real app)
const CURRENT_USER_ID = "user3";

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
  
  // Mock data for demonstration (would be fetched from Firestore in production)
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    // Mock data (would be replaced with Firestore fetch)
    setTimeout(() => {
      try {
        const mockLeaderboardData: LeaderboardUser[] = [
          { id: "user1", name: "Alex Johnson", averageScore: 92.5, interviewsTaken: 15, isPrivate: false },
          { id: "user2", name: "Jamie Smith", averageScore: 90.8, interviewsTaken: 12, isPrivate: false },
          { id: "user3", name: "Taylor Wilson", averageScore: 88.6, interviewsTaken: 18, isPrivate: false },
          { id: "user4", name: "Jordan Lee", averageScore: 87.9, interviewsTaken: 9, isPrivate: true },
          { id: "user5", name: "Casey Brown", averageScore: 85.3, interviewsTaken: 14, isPrivate: false },
          { id: "user6", name: "Riley Garcia", averageScore: 84.7, interviewsTaken: 11, isPrivate: false },
          { id: "user7", name: "Morgan Lewis", averageScore: 83.2, interviewsTaken: 16, isPrivate: true },
          { id: "user8", name: "Dakota Martinez", averageScore: 82.8, interviewsTaken: 10, isPrivate: false },
          { id: "user9", name: "Avery Robinson", averageScore: 81.4, interviewsTaken: 13, isPrivate: false },
          { id: "user10", name: "Jordan Thomas", averageScore: 80.9, interviewsTaken: 7, isPrivate: true },
          { id: "user11", name: "Quinn Adams", averageScore: 79.5, interviewsTaken: 9, isPrivate: false },
          { id: "user12", name: "Drew Evans", averageScore: 78.3, interviewsTaken: 12, isPrivate: false },
          { id: "user13", name: "Hayden Wright", averageScore: 77.6, interviewsTaken: 8, isPrivate: true },
          { id: "user14", name: "Reese Diaz", averageScore: 76.9, interviewsTaken: 11, isPrivate: false },
          { id: "user15", name: "Skyler Cook", averageScore: 75.4, interviewsTaken: 10, isPrivate: false },
        ];
        
        // Sort by average score in descending order
        const sortedData = [...mockLeaderboardData].sort((a, b) => b.averageScore - a.averageScore);
        
        setLeaderboardData(sortedData);
        setFilteredData(sortedData);
        
        // Find current user position
        const currentUser = sortedData.find(user => user.id === CURRENT_USER_ID);
        const userRank = currentUser ? sortedData.findIndex(user => user.id === CURRENT_USER_ID) + 1 : null;
        
        setCurrentUserData(currentUser || null);
        setCurrentUserRank(userRank);
        setIsLoading(false);
        
        toast({
          title: "Leaderboard loaded",
          description: "Using demonstration data for preview.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setError("Failed to load leaderboard data");
        setIsLoading(false);
        toast({
          title: "Error loading data",
          description: "Could not load leaderboard data",
          variant: "destructive",
        });
      }
    }, 1500);
    
    // In a real app with Firebase, we would use:
    // const unsubscribe = onSnapshot(query(collection(db, "Analytics"), orderBy("averageScore", "desc")), (snapshot) => {
    //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //   setLeaderboardData(data);
    //   setCurrentUserData(data.find(user => user.id === currentUserId));
    //   setCurrentUserRank(data.findIndex(user => user.id === currentUserId) + 1);
    //   setIsLoading(false);
    // });
    // return () => unsubscribe();
    
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
          {/* Top 10 Users */}
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
    </div>
  );
};

export default Leaderboard;
