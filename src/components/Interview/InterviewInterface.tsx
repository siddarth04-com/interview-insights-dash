
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, Video, Pause, Play, Timer } from "lucide-react";
import QuestionDisplay from "./QuestionDisplay";
import VideoFeed from "./VideoFeed";
import TranscriptionPanel from "./TranscriptionPanel";

// Real interview questions by exam type
const REAL_QUESTIONS = {
  "UPSC": [
    "What are the ethical considerations you would keep in mind while implementing a government program in a culturally diverse district?",
    "How would you balance development needs with environmental conservation in your administrative decisions?",
    "Explain your approach to handling a situation where local interests conflict with national policy directives.",
    "How would you ensure transparency and accountability in the implementation of welfare schemes?",
    "Discuss the challenges in implementing Right to Education Act in rural areas and your strategies to address them."
  ],
  "NDA": [
    "Describe a situation where you had to make a difficult decision under pressure. How did you handle it?",
    "What motivates you to join the armed forces despite the hardships and personal sacrifices involved?",
    "How would you maintain discipline and morale among your unit during extended periods of difficult deployment?",
    "Describe how you would approach leading a diverse team with members from different cultural backgrounds.",
    "How do you view the evolving role of technology in modern warfare and defense strategies?"
  ],
  "State PSC": [
    "How would you address the issue of water management in drought-prone areas within your state?",
    "Discuss your strategy for improving the implementation of public welfare schemes at the grassroots level.",
    "How would you balance regional development disparities while working within budgetary constraints?",
    "What measures would you take to improve the quality of education in government schools in your state?",
    "How would you encourage citizen participation in local governance and development initiatives?"
  ]
};

// Default question time limit in seconds
const DEFAULT_QUESTION_TIME = 120;

interface InterviewInterfaceProps {
  examType: string;
}

export default function InterviewInterface({ examType }: InterviewInterfaceProps) {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_QUESTION_TIME);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions when component mounts
  useEffect(() => {
    // Use our real questions instead of mock data
    const questionsForType = REAL_QUESTIONS[examType as keyof typeof REAL_QUESTIONS] || [];
    setQuestions(questionsForType);
  }, [examType]);

  // Handle timer logic
  useEffect(() => {
    if (isInterviewStarted && !isPaused && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto move to next question when timer expires
      handleNextQuestion();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isInterviewStarted, isPaused, timeLeft]);

  // Start the interview session
  const handleStartInterview = () => {
    setIsInterviewStarted(true);
    setTimeLeft(DEFAULT_QUESTION_TIME);
    setCurrentQuestionIndex(0);
    
    // Start mock transcription
    startMockTranscription();
    
    toast.success("Interview started. Good luck!");
  };

  // Pause or resume the interview
  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      toast.info("Interview resumed.");
    } else {
      toast.info("Interview paused.");
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(DEFAULT_QUESTION_TIME);
      
      // Reset transcript for new question
      setTranscript("");
      startMockTranscription();
      
      toast.info("Moving to the next question.");
    } else {
      // End of interview
      endInterview();
    }
  };

  // End the interview session
  const endInterview = () => {
    setIsInterviewStarted(false);
    setIsPaused(false);
    setTranscript("");
    setIsTranscribing(false);
    
    toast.success("Interview completed! You can view your performance on the dashboard.", {
      duration: 5000,
    });
  };

  // Toggle video on/off
  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
  };

  // Toggle microphone on/off
  const toggleMicrophone = () => {
    setIsMicOn((prev) => !prev);
    if (isMicOn) {
      setIsTranscribing(false);
    } else if (isInterviewStarted) {
      startMockTranscription();
    }
  };

  // Start mock transcription (simulating Whisper API)
  const startMockTranscription = () => {
    if (!isMicOn || !isInterviewStarted) return;
    
    setIsTranscribing(true);
    
    // In a real app, this would connect to Whisper API
    // For now, simulate transcription with mock data
    const mockResponses = [
      "I believe that addressing this challenge requires a multi-faceted approach...",
      "When considering this issue, it's important to look at both short-term and long-term solutions...",
      "The key factors to consider here include stakeholder engagement and policy implementation...",
      "Based on my understanding, there are several critical aspects to consider...",
    ];
    
    // Add words gradually to simulate real-time transcription
    let words = mockResponses[Math.floor(Math.random() * mockResponses.length)].split(" ");
    let currentIndex = 0;
    
    const transcriptionInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setTranscript(prev => prev + " " + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(transcriptionInterval);
      }
    }, 600); // Add a new word every 600ms
    
    return () => clearInterval(transcriptionInterval);
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Video feed */}
        <div className="w-full md:w-2/3 bg-black relative">
          <VideoFeed isOn={isVideoOn} />
          
          {/* Interview controls overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVideo}
              className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              <Video className={isVideoOn ? "text-green-500" : "text-red-500"} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMicrophone}
              className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              {isMicOn ? <Mic className="text-green-500" /> : <MicOff className="text-red-500" />}
            </Button>
            
            {isInterviewStarted && (
              <Button
                variant="outline"
                size="icon"
                onClick={togglePause}
                className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
              >
                {isPaused ? <Play /> : <Pause />}
              </Button>
            )}
          </div>
        </div>
        
        {/* Right side - Interview info */}
        <div className="w-full md:w-1/3 bg-background p-4 flex flex-col">
          {!isInterviewStarted ? (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
              <Card className="p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">{examType} Interview Simulation</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Get ready for your {examType} interview. This simulation will contain {questions.length} questions, with 2 minutes per question.
                </p>
                <Button className="w-full" onClick={handleStartInterview}>
                  Start Interview
                </Button>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col gap-4 h-full">
              {/* Timer display */}
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-5 w-5" />
                <div className="text-xl font-mono">{formatTime(timeLeft)}</div>
              </div>
              
              {/* Progress indicator */}
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <Progress value={(currentQuestionIndex + 1) * (100 / questions.length)} className="h-2" />
              </div>
              
              {/* Question display */}
              <QuestionDisplay 
                question={questions[currentQuestionIndex] || ""}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
              />
              
              {/* Transcription area */}
              <TranscriptionPanel 
                transcript={transcript} 
                isTranscribing={isTranscribing && !isPaused}
                isMicOn={isMicOn}
              />
              
              {/* Next button */}
              <Button 
                onClick={handleNextQuestion} 
                disabled={isPaused}
                className="mt-auto"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "End Interview"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
