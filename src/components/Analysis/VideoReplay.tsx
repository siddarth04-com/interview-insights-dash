
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/components/ui/use-toast";
import { Download, Maximize, Volume2, VolumeX } from "lucide-react";

interface VideoReplayProps {
  recordingUrl: string;
}

export default function VideoReplay({ recordingUrl }: VideoReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleDownload = () => {
    // In a real implementation, this would trigger a download of the video file
    toast({
      title: "Download Started",
      description: "Your interview recording is being downloaded.",
    });
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(err => {
          toast({
            title: "Fullscreen Error",
            description: "Could not enter fullscreen mode.",
            variant: "destructive",
          });
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Replay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden bg-black">
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <video
              ref={videoRef}
              src={recordingUrl}
              className="h-full w-full object-cover"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </AspectRatio>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
          
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
