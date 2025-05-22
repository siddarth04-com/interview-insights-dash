
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import InterviewInterface from "@/components/Interview/InterviewInterface";
import { toast } from "@/components/ui/sonner";
import NotFoundContent from "@/components/Interview/NotFoundContent";

// Supported interview types
const SUPPORTED_TYPES = ["UPSC", "NDA", "State PSC"];

export default function Interview() {
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("type");
  
  // Check if the interview type is valid
  const isValidType = examType && SUPPORTED_TYPES.includes(examType);
  
  if (!isValidType) {
    return <NotFoundContent />;
  }

  return (
    <div className="min-h-screen bg-background">
      <InterviewInterface examType={examType} />
      <AnalysisLink />
    </div>
  );
}

function AnalysisLink() {
  // Get the most recent session from localStorage
  const getSampleSessionId = () => {
    const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    if (savedSessions.length > 0) {
      // Return the most recent session
      return savedSessions[savedSessions.length - 1].id;
    }
    return 'sample-session'; // Default sample session
  };

  return (
    <div className="mt-4 text-center p-2 fixed bottom-0 w-full bg-background/80 backdrop-blur-sm">
      <p className="mb-2">Want to see analysis of your interviews?</p>
      <Link to={`/analysis/${getSampleSessionId()}`} className="text-primary hover:underline">
        View Analysis
      </Link>
    </div>
  );
}

export { AnalysisLink };
