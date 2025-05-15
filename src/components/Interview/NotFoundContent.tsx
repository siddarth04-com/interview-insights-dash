
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function NotFoundContent() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Invalid Interview Type</AlertTitle>
        <AlertDescription>
          The interview type specified is not valid or not supported.
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <p className="mb-4">Please select a valid interview type:</p>
        <div className="flex flex-col gap-2 mb-4">
          <Button asChild>
            <Link to="/interview?type=UPSC">UPSC Interview</Link>
          </Button>
          <Button asChild>
            <Link to="/interview?type=NDA">NDA Interview</Link>
          </Button>
          <Button asChild>
            <Link to="/interview?type=State%20PSC">State PSC Interview</Link>
          </Button>
        </div>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
