
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Maximize, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ videoUrl, title, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when URL changes
    setIsLoading(true);
    setError(null);
  }, [videoUrl]);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError("Unable to load video. Please check the URL and try again.");
    setIsLoading(false);
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
    <Card className="w-full">
      {title && (
        <div className="p-4 pb-0">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <CardContent className="p-4">
        <div className="relative rounded-md overflow-hidden bg-black">
          <AspectRatio ratio={16 / 9} className="bg-muted">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            
            <video
              ref={videoRef}
              src={videoUrl}
              className="h-full w-full object-contain"
              controls
              autoPlay={autoPlay}
              onLoadedData={handleLoadedData}
              onError={handleError}
            />

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-destructive max-w-md text-center p-4">
                  {error}
                </div>
              </div>
            )}
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
        </div>
      </CardContent>
    </Card>
  );
}
