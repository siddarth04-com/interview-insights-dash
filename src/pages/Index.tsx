
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">Welcome to InterviewPrep AI</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Prepare for your interviews with AI-powered feedback and analysis
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Practice Interview</CardTitle>
            <CardDescription>Start a new interview session</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Choose your interview type and practice with AI-generated questions and real-time feedback.</p>
          </CardContent>
          <CardFooter>
            <Link to="/interview">
              <Button>Start Interview</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>View Leaderboard</CardTitle>
            <CardDescription>See how you rank against others</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Compare your performance with other candidates and track your improvement over time.</p>
          </CardContent>
          <CardFooter>
            <Link to="/leaderboard">
              <Button variant="outline">View Leaderboard</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sample Analysis</CardTitle>
            <CardDescription>View a sample interview analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Check out a sample analysis report to see what insights you'll get after completing an interview.</p>
          </CardContent>
          <CardFooter>
            <Link to="/analysis/sample-session">
              <Button variant="outline">View Sample Analysis</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {!user && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Track your progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sign up to save your interview results, track your improvement, and compete on the leaderboard.</p>
          </CardContent>
          <CardFooter>
            <Link to="/auth">
              <Button>Sign Up Now</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
