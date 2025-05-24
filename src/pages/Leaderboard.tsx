
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import LeaderboardTable from "@/components/Leaderboard/LeaderboardTable";
import LeaderboardSkeleton from "@/components/Leaderboard/LeaderboardSkeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

interface LeaderboardUser {
  user_id: string;
  display_name: string;
  average_score: number;
  interviews_taken: number;
  is_public: boolean;
  last_interview: string;
}

const Leaderboard = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!session && !user) {
      navigate("/auth");
    }
  }, [session, user, navigate]);

  // Fetch leaderboard data
  const { data: leaderboardData = [], isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard_view')
        .select('*')
        .eq('is_public', true)
        .order('average_score', { ascending: false });
      
      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }
      
      return data as LeaderboardUser[];
    },
    enabled: !!session,
  });

  // Fetch current user's data including private data
  const { data: currentUserData } = useQuery({
    queryKey: ['current-user-leaderboard', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('leaderboard_view')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current user data:', error);
        throw error;
      }
      
      return data as LeaderboardUser | null;
    },
    enabled: !!user?.id,
  });

  // Filter data based on search query
  const filteredData = leaderboardData.filter(user => 
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Find current user rank
  const currentUserRank = currentUserData ? 
    leaderboardData.findIndex(u => u.user_id === currentUserData.user_id) + 1 : null;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page on new search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!session || !user) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view the leaderboard and compete with other users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Failed to load leaderboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Interview Leaderboard</h1>
      
      {leaderboardData.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No Users on Leaderboard Yet</h2>
          <p className="text-muted-foreground mb-6">
            Be the first to complete an interview and appear on the leaderboard!
          </p>
          <Button onClick={() => navigate("/interview")}>
            Start an Interview
          </Button>
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
              {/* Leaderboard Table */}
              <LeaderboardTable 
                users={currentPageData.map((user, index) => ({
                  id: user.user_id,
                  name: user.display_name,
                  averageScore: user.average_score,
                  interviewsTaken: user.interviews_taken,
                  isPrivate: !user.is_public
                }))} 
                currentUserId={user?.id || ''}
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
              
              {/* Current user position (if not in top positions and exists) */}
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
                          <p className="font-semibold">
                            {currentUserData.display_name}
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full ml-2">You</span>
                          </p>
                          <p className="text-sm text-gray-600">{currentUserData.interviews_taken} interviews</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold">{currentUserData.average_score.toFixed(1)}%</div>
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
