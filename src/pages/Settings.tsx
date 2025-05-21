
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";

interface UserPreferences {
  theme: string;
  notification_enabled: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "system",
    notification_enabled: true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setPreferences({
            theme: data.theme || "system",
            notification_enabled: data.notification_enabled || false,
          });
          
          // Sync theme with the app's theme state
          if (data.theme) {
            setTheme(data.theme as "light" | "dark" | "system");
          }
        } else {
          // Create default preferences if none exist
          await createDefaultPreferences();
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast({
          title: "Error loading preferences",
          description: "Could not load your preferences.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user, navigate, toast, setTheme]);

  const createDefaultPreferences = async () => {
    try {
      const defaultPreferences = {
        user_id: user!.id,
        theme: theme,
        notification_enabled: true,
      };

      const { error } = await supabase
        .from("user_preferences")
        .insert(defaultPreferences);

      if (error) throw error;

      setPreferences({
        theme: theme,
        notification_enabled: true,
      });
    } catch (error) {
      console.error("Error creating default preferences:", error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({
          theme: preferences.theme,
          notification_enabled: preferences.notification_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving settings",
        description: "Could not save your preferences.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setPreferences({ ...preferences, theme: newTheme });
    setTheme(newTheme);
  };

  const handleNotificationChange = (enabled: boolean) => {
    setPreferences({ ...preferences, notification_enabled: enabled });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loading settings...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your app preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize how the app looks
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={preferences.theme === "light" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleThemeChange("light")}
              >
                Light
              </Button>
              <Button
                variant={preferences.theme === "dark" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleThemeChange("dark")}
              >
                Dark
              </Button>
              <Button
                variant={preferences.theme === "system" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleThemeChange("system")}
              >
                System
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure your notification preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={preferences.notification_enabled}
                onCheckedChange={handleNotificationChange}
              />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={savePreferences}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
