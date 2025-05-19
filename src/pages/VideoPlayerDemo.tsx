
import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample video URLs
const SAMPLE_VIDEOS = [
  {
    title: "Big Buck Bunny",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    title: "Elephant Dream",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    title: "Sintel",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  }
];

export default function VideoPlayerDemo() {
  const [customUrl, setCustomUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState(SAMPLE_VIDEOS[0]);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      setCurrentVideo({
        title: "Custom Video",
        url: customUrl
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Video Player</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VideoPlayer 
            videoUrl={currentVideo.url} 
            title={currentVideo.title} 
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Videos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SAMPLE_VIDEOS.map((video, index) => (
                <Button 
                  key={index}
                  variant={currentVideo.url === video.url ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setCurrentVideo(video)}
                >
                  {video.title}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom URL</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomUrlSubmit} className="space-y-4">
                <Input
                  type="url"
                  placeholder="Enter video URL"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <Button type="submit" className="w-full">Load Video</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
