
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
    </div>
  );
}

function AnalysisLink() {
  return (
    <div className="mt-4 text-center">
      <p className="mb-2">Want to see a sample analysis?</p>
      <Link to="/analysis/sample-session" className="text-primary hover:underline">
        View Sample Analysis
      </Link>
    </div>
  );
}

export { AnalysisLink };
