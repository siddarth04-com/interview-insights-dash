
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const LeaderboardSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['leaderboard-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_leaderboard_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data) {
        setDisplayName(data.display_name || '');
        setIsPublic(data.is_public);
      }
    }
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (newSettings: { display_name: string; is_public: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_leaderboard_settings')
        .upsert({
          user_id: user.id,
          display_name: newSettings.display_name,
          is_public: newSettings.is_public,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your leaderboard preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update settings",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error('Settings update error:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({
      display_name: displayName,
      is_public: isPublic
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard Settings</CardTitle>
        <CardDescription>
          Manage how you appear on the interview leaderboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you want to appear on the leaderboard"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="isPublic">
              Show me on the public leaderboard
            </Label>
          </div>
          
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSettings;
