
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface LeaderboardUser {
  id: string;
  name: string;
  averageScore: number;
  interviewsTaken: number;
  isPrivate: boolean;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  currentUserId: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users, currentUserId }) => {
  if (users.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No users found matching your search criteria.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Average Score</TableHead>
            <TableHead className="text-right">Interviews</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const startPosition = users.length > 10 ? (Math.floor(index / 10) * 10) + 1 : 1;
            const rank = startPosition + index;
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <TableRow 
                key={user.id} 
                className={isCurrentUser ? "bg-blue-50 hover:bg-blue-100" : undefined}
              >
                <TableCell className="font-medium">
                  <RankBadge rank={rank} />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium flex items-center">
                        {user.isPrivate ? "Anonymous User" : user.name}
                        {isCurrentUser && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full ml-2">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="font-bold cursor-help">
                        {user.averageScore.toFixed(1)}%
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-56">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Score Details</p>
                        <p className="text-xs text-muted-foreground">
                          This is an average of all interview scores achieved by this user.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                
                <TableCell className="text-right">{user.interviewsTaken}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  let badgeClass = "";
  
  switch (rank) {
    case 1:
      badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
      break;
    case 2:
      badgeClass = "bg-gray-100 text-gray-800 border-gray-300";
      break;
    case 3:
      badgeClass = "bg-amber-100 text-amber-800 border-amber-300";
      break;
    default:
      badgeClass = "bg-white";
  }
  
  return (
    <div className={`flex items-center justify-center h-8 w-8 rounded-full border ${badgeClass}`}>
      <span className="font-bold">{rank}</span>
    </div>
  );
};

export default LeaderboardTable;
