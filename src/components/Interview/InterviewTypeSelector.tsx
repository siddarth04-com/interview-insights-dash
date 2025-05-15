
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function InterviewTypeSelector() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Practice Interviews</CardTitle>
        <CardDescription>Select an interview type to begin practicing</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/interview?type=UPSC" className="contents">
          <Button variant="outline" className="h-auto py-6 flex flex-col">
            <span className="text-lg font-medium">UPSC</span>
            <span className="text-xs text-muted-foreground mt-1">Civil Services</span>
          </Button>
        </Link>
        
        <Link to="/interview?type=NDA" className="contents">
          <Button variant="outline" className="h-auto py-6 flex flex-col">
            <span className="text-lg font-medium">NDA</span>
            <span className="text-xs text-muted-foreground mt-1">National Defence Academy</span>
          </Button>
        </Link>
        
        <Link to="/interview?type=State%20PSC" className="contents">
          <Button variant="outline" className="h-auto py-6 flex flex-col">
            <span className="text-lg font-medium">State PSC</span>
            <span className="text-xs text-muted-foreground mt-1">Public Service Commission</span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
