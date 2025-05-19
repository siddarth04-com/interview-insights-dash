
import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// User's YouTube videos
const YOUTUBE_VIDEOS = [
  {
    title: "YouTube Video 1",
    url: "https://www.youtube.com/embed/Y2l1h_3qBRM"
  },
  {
    title: "YouTube Video 2",
    url: "https://www.youtube.com/embed/zGNTAw7Exew"
  },
  {
    title: "YouTube Video 3",
    url: "https://www.youtube.com/embed/Xht1OlFPpmk"
  },
  {
    title: "YouTube Video 4",
    url: "https://www.youtube.com/embed/3hUA746mazQ"
  },
  {
    title: "YouTube Video 5",
    url: "https://www.youtube.com/embed/OaDEkwv6tzk"
  },
  {
    title: "YouTube Video 6",
    url: "https://www.youtube.com/embed/PM4TUY7DeGw"
  },
  {
    title: "YouTube Video 7",
    url: "https://www.youtube.com/embed/7gULEMMFpZI"
  },
  {
    title: "YouTube Video 8",
    url: "https://www.youtube.com/embed/SmOE8f3VOdo"
  }
];

export default function VideoPlayerDemo() {
  const [customUrl, setCustomUrl] = useState("");
  const [activeTab, setActiveTab] = useState("sample");
  const [currentVideo, setCurrentVideo] = useState(SAMPLE_VIDEOS[0]);
  const [currentYoutubeVideo, setCurrentYoutubeVideo] = useState(YOUTUBE_VIDEOS[0]);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      setCurrentVideo({
        title: "Custom Video",
        url: customUrl
      });
      setActiveTab("sample");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Video Player</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="sample">Sample Videos</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sample">
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
        </TabsContent>
        
        <TabsContent value="youtube">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                <iframe
                  src={currentYoutubeVideo.url}
                  title={currentYoutubeVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>YouTube Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                  {YOUTUBE_VIDEOS.map((video, index) => (
                    <Button 
                      key={index}
                      variant={currentYoutubeVideo.url === video.url ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setCurrentYoutubeVideo(video)}
                    >
                      {video.title}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
