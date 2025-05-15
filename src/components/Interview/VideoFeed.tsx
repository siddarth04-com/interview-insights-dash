
import React, { useEffect, useRef, useState } from "react";

interface VideoFeedProps {
  isOn: boolean;
}

export default function VideoFeed({ isOn }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupVideoStream = async () => {
      try {
        if (isOn) {
          setIsLoading(true);
          setStreamError(null);
          
          // Request access to webcam
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false // We handle audio separately
          });
          
          // Set the stream as the video source
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          // Turn off the video stream
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setStreamError("Unable to access camera. Please check permissions and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    setupVideoStream();

    // Clean up
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOn]);

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-neutral-900">
      {isOn ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedData={handleVideoLoaded}
            className={`h-full w-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">
                Loading camera...
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="p-4 text-center text-muted-foreground">
            Camera is turned off
          </div>
        </div>
      )}
      
      {streamError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-destructive max-w-md text-center p-4">
            {streamError}
          </div>
        </div>
      )}
    </div>
  );
}
