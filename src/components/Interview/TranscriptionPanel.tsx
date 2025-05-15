
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TranscriptionPanelProps {
  transcript: string;
  isTranscribing: boolean;
  isMicOn: boolean;
}

export default function TranscriptionPanel({ transcript, isTranscribing, isMicOn }: TranscriptionPanelProps) {
  return (
    <Card className="flex-grow overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-grow overflow-y-auto relative">
        <h3 className="font-semibold mb-2">Your Response:</h3>
        
        {isMicOn ? (
          <div>
            <p className="whitespace-pre-wrap">{transcript}</p>
            {isTranscribing && (
              <span className="inline-block animate-pulse">▌</span>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground italic">
            Microphone is turned off. Enable it to see your transcribed response.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
