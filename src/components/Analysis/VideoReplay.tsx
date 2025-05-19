
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

interface VideoReplayProps {
  recordingUrl: string;
}

export default function VideoReplay({ recordingUrl }: VideoReplayProps) {
  const handleDownload = () => {
    // In a real implementation, this would trigger a download of the video file
    toast({
      title: "Download Started",
      description: "Your interview recording is being downloaded.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Replay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <VideoPlayer videoUrl={recordingUrl} />
        
        <div className="flex justify-end">
          <Button 
            variant="default" 
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Recording
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
