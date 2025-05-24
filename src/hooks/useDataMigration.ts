
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useDataMigration = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const migrateLocalStorageData = async () => {
      if (!user || !session) return;

      try {
        // Check if migration has already been done
        const migrationKey = `migration_done_${user.id}`;
        const migrationDone = localStorage.getItem(migrationKey);
        
        if (migrationDone) return;

        // Get localStorage data
        const savedSessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
        
        if (savedSessions.length === 0) {
          localStorage.setItem(migrationKey, 'true');
          return;
        }

        // Transform and insert data into Supabase
        const sessionsToInsert = savedSessions.map((session: any) => ({
          user_id: user.id,
          session_name: session.sessionName || `Interview Session ${new Date(session.completedAt || Date.now()).toLocaleDateString()}`,
          interview_type: session.interviewType || 'general',
          overall_score: session.overallScore || 0,
          communication_score: session.communicationScore || 0,
          technical_score: session.technicalScore || 0,
          confidence_score: session.confidenceScore || 0,
          clarity_score: session.clarityScore || 0,
          questions_answered: session.questionsAnswered || 0,
          total_questions: session.totalQuestions || 0,
          duration_minutes: session.durationMinutes || 0,
          completed_at: session.completedAt || new Date().toISOString(),
        }));

        const { error } = await supabase
          .from('interview_sessions')
          .insert(sessionsToInsert);

        if (error) {
          console.error('Migration error:', error);
          return;
        }

        // Create default leaderboard settings
        const { error: settingsError } = await supabase
          .from('user_leaderboard_settings')
          .insert({
            user_id: user.id,
            is_public: true,
            display_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous User'
          });

        if (settingsError && settingsError.code !== '23505') {
          console.error('Settings creation error:', settingsError);
        }

        // Mark migration as complete
        localStorage.setItem(migrationKey, 'true');
        
        toast({
          title: "Data migrated successfully",
          description: `${savedSessions.length} interview session${savedSessions.length > 1 ? 's' : ''} migrated to your account.`,
        });

      } catch (error) {
        console.error('Migration failed:', error);
      }
    };

    migrateLocalStorageData();
  }, [user, session, toast]);
};
