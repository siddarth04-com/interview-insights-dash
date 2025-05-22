import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, Pause, Play, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_QUESTION_TIME);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load questions when component mounts
  useEffect(() => {
    // Use our real questions instead of mock data
    const questionsForType = REAL_QUESTIONS[examType as keyof typeof REAL_QUESTIONS] || [];
    setQuestions(questionsForType);
    
    // Initialize empty responses array
    setResponses(new Array(questionsForType.length).fill(""));
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

  // Initialize Web Speech API
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      if (!isMicOn || isPaused) return;
      
      let interimTranscript = '';
      let finalTranscript = transcript;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      setTranscript(finalTranscript);
      
      // Save response to the responses array
      const updatedResponses = [...responses];
      updatedResponses[currentQuestionIndex] = finalTranscript;
      setResponses(updatedResponses);
      
      if (interimTranscript) {
        setIsTranscribing(true);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsTranscribing(false);
      
      if (event.error === 'not-allowed') {
        toast.error("Microphone access was denied");
        setIsMicOn(false);
      }
    };
    
    recognition.onend = () => {
      setIsTranscribing(false);
      // Restart if still recording and not paused
      if (isMicOn && isInterviewStarted && !isPaused) {
        recognition.start();
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping recognition that wasn't started
        }
      }
    };
  }, []);

  // Start the interview session
  const handleStartInterview = () => {
    setIsInterviewStarted(true);
    setTimeLeft(DEFAULT_QUESTION_TIME);
    setCurrentQuestionIndex(0);
    setTranscript("");
    
    // Start real transcription if mic is on
    if (isMicOn && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsTranscribing(true);
      } catch (e) {
        console.error('Could not start speech recognition', e);
        toast.error("Could not start speech recognition");
      }
    }
    
    toast.success("Interview started. Good luck!");
  };

  // Pause or resume the interview
  const togglePause = () => {
    setIsPaused((prev) => !prev);
    
    // Handle speech recognition based on pause state
    if (isPaused) {
      // Resume interview
      if (isMicOn && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore errors when starting already started recognition
        }
      }
      toast.info("Interview resumed.");
    } else {
      // Pause interview
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping recognition
        }
      }
      toast.info("Interview paused.");
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    // Save current response
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = transcript;
    setResponses(updatedResponses);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(DEFAULT_QUESTION_TIME);
      
      // Reset transcript for new question
      setTranscript("");
      
      toast.info("Moving to the next question.");
    } else {
      // End of interview
      endInterview();
    }
  };

  // Skip the timer and proceed to next question
  const handleSkipTimer = () => {
    setTimeLeft(0);
    toast.info("Timer skipped.");
  };

  // End the interview session
  const endInterview = () => {
    setIsInterviewStarted(false);
    setIsPaused(false);
    
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping recognition
      }
    }
    
    setIsTranscribing(false);
    
    // Calculate score based on responses
    const scores = calculateScores(responses, questions);
    
    // Create a session ID (timestamp for simplicity)
    const sessionId = Date.now().toString();
    
    // Save session data to localStorage for persistence
    const sessionData = {
      id: sessionId,
      examType,
      questions,
      responses,
      scores,
      date: new Date().toISOString(),
      overallScore: scores.overallScore,
    };
    
    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
    savedSessions.push(sessionData);
    localStorage.setItem('interviewSessions', JSON.stringify(savedSessions));
    
    toast.success("Interview completed! View your results on the analysis page.", {
      duration: 5000,
    });
    
    // Navigate to analysis page
    navigate(`/analysis/${sessionId}`);
  };

  // Calculate scores based on responses
  const calculateScores = (responses: string[], questions: string[]) => {
    // Basic scoring logic (in a real app, this would use AI/ML)
    const categoryScores: {[key: string]: number} = {
      "Subject Knowledge": 0,
      "Analytical Thinking": 0,
      "Communication Clarity": 0,
      "Language Accuracy": 0,
      "Confidence & Body Language": 70, // Assuming average score for non-assessable metrics
    };
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Simple scoring based on response length and keyword presence
    responses.forEach((response, index) => {
      if (!response) return;
      
      // Subject knowledge (based on keyword presence)
      const subjectScore = Math.min(85, 50 + (countRelevantKeywords(response, questions[index]) * 5));
      categoryScores["Subject Knowledge"] = Math.round((categoryScores["Subject Knowledge"] + subjectScore) / 2);
      
      // Analytical thinking (based on specific phrases)
      const analyticalKeywords = ['because', 'therefore', 'however', 'analysis', 'consider', 'evaluate'];
      const analyticalScore = Math.min(90, 60 + (countKeywords(response, analyticalKeywords) * 5));
      categoryScores["Analytical Thinking"] = Math.round((categoryScores["Analytical Thinking"] + analyticalScore) / 2);
      
      // Communication clarity (based on sentence structure)
      const avgSentenceLength = getAverageSentenceLength(response);
      const clarityScore = avgSentenceLength > 5 && avgSentenceLength < 20 ? 80 : 60;
      categoryScores["Communication Clarity"] = Math.round((categoryScores["Communication Clarity"] + clarityScore) / 2);
      
      // Language accuracy (simple heuristic)
      const grammarScore = Math.min(85, 60 + (response.split(' ').length / 10));
      categoryScores["Language Accuracy"] = Math.round((categoryScores["Language Accuracy"] + grammarScore) / 2);
    });
    
    // Determine strengths and weaknesses
    const sortedScores = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
    
    // Top 2 categories as strengths
    strengths.push(...sortedScores.slice(0, 2).map(([category]) => category));
    
    // Bottom 2 categories as weaknesses
    weaknesses.push(...sortedScores.slice(-2).map(([category]) => category));
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (
        categoryScores["Subject Knowledge"] * 0.3 +
        categoryScores["Analytical Thinking"] * 0.25 +
        categoryScores["Communication Clarity"] * 0.2 +
        categoryScores["Language Accuracy"] * 0.15 +
        categoryScores["Confidence & Body Language"] * 0.1
      )
    );
    
    return {
      overallScore,
      categoryScores,
      strengths,
      weaknesses
    };
  };

  // Helper function to count relevant keywords
  const countRelevantKeywords = (response: string, question: string) => {
    const keywords = question.toLowerCase().split(' ')
      .filter(word => word.length > 4)  // Only consider significant words
      .filter(word => !['what', 'how', 'would', 'could', 'should', 'while', 'have', 'your'].includes(word));
    
    return keywords.reduce((count, keyword) => {
      return count + (response.toLowerCase().includes(keyword) ? 1 : 0);
    }, 0);
  };

  // Helper function to count keywords
  const countKeywords = (text: string, keywords: string[]) => {
    return keywords.reduce((count, keyword) => {
      return count + (text.toLowerCase().match(new RegExp(`\\b${keyword}\\b`, 'g'))?.length || 0);
    }, 0);
  };

  // Helper function to get average sentence length
  const getAverageSentenceLength = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    const wordCount = sentences.reduce((total, sentence) => {
      return total + sentence.trim().split(/\s+/).length;
    }, 0);
    
    return wordCount / sentences.length;
  };

  // Toggle video on/off
  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
  };

  // Toggle microphone on/off
  const toggleMicrophone = () => {
    setIsMicOn((prev) => !prev);
    
    if (isMicOn) {
      // Turn off microphone
      setIsTranscribing(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping recognition
        }
      }
    } else if (isInterviewStarted && !isPaused) {
      // Turn on microphone
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsTranscribing(true);
        } catch (e) {
          console.error('Could not restart speech recognition', e);
        }
      }
    }
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <div className="text-xl font-mono">{formatTime(timeLeft)}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSkipTimer}
                  disabled={isPaused}
                >
                  Skip Timer
                </Button>
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
