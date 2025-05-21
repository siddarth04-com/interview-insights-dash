
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
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
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
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData?.avatar_url || ""} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>View and edit your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
