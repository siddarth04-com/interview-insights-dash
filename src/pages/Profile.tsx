
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import AvatarSelector from "@/components/UserProfile/AvatarSelector";

interface ProfileData {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData(data);
          setUsername(data.username || "");
          setFullName(data.full_name || "");
          setAvatarUrl(data.avatar_url || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: "Could not load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const updateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const updates = {
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      // Update profile in database
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update user metadata
      await supabase.auth.updateUser({
        data: { 
          username, 
          full_name: fullName,
          avatar_url: avatarUrl
        }
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setShowAvatarSelector(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "Could not update your profile.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectAvatar = (url: string) => {
    setAvatarUrl(url);
  };

  // Get initials from email for avatar fallback
  const getInitials = () => {
    if (!user) return "";
    const email = user.email || "";
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              >
                {showAvatarSelector ? "×" : "✏️"}
              </Button>
            </div>
          </div>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>View and edit your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAvatarSelector && (
            <div className="mb-6">
              <AvatarSelector selected={avatarUrl} onSelect={handleSelectAvatar} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profileData?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Choose a username" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Your full name" 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={updateProfile}
            disabled={updating}
          >
            {updating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
