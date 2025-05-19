
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2, VolumeX, Maximize } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ videoUrl, title, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    // Reset state when URL changes
    setIsLoading(true);
    setError(null);
    
    // Check if the URL is a YouTube URL
    const isYouTubeUrl = videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com');
    setIsYouTube(isYouTubeUrl);
  }, [videoUrl]);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError("Unable to load video. Please check the URL and try again.");
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    if (isYouTube && iframeRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframeRef.current.requestFullscreen().catch(err => {
          toast({
            title: "Fullscreen Error",
            description: "Could not enter fullscreen mode.",
            variant: "destructive",
          });
        });
      }
    } else if (videoRef.current) {
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
    if (isYouTube && iframeRef.current) {
      // This won't work directly with the iframe - would need YouTube API integration
      // For simplicity, we'll just show a toast message
      toast({
        title: "YouTube Control",
        description: "Please use the YouTube player controls to adjust volume.",
      });
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert various YouTube URL formats to embed format
    let videoId = '';
    
    // Handle youtu.be format
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
      // Remove any query parameters
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    } 
    // Handle youtube.com format
    else if (url.includes('youtube.com')) {
      // Handle watch URLs
      if (url.includes('v=')) {
        videoId = url.split('v=')[1];
        // Remove any additional parameters
        if (videoId.includes('&')) {
          videoId = videoId.split('&')[0];
        }
      }
      // Handle embed URLs
      else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1];
        // Remove any query parameters
        if (videoId.includes('?')) {
          videoId = videoId.split('?')[0];
        }
      }
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
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
            {isLoading && !isYouTube && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            
            {isYouTube ? (
              <iframe
                ref={iframeRef}
                src={`${getYouTubeEmbedUrl(videoUrl)}?autoplay=${autoPlay ? 1 : 0}`}
                className="h-full w-full"
                title={title || "YouTube Video"}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setIsLoading(false)}
                onError={handleError}
              />
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                className="h-full w-full object-contain"
                controls
                autoPlay={autoPlay}
                onLoadedData={handleLoadedData}
                onError={handleError}
              />
            )}

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
            {!isYouTube && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            )}
            
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
