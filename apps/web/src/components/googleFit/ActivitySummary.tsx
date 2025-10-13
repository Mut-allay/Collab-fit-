import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyActivity } from '@/hooks/useDailyActivity';
import { useGoogleFit } from '@/hooks/useGoogleFit';
import { useEffect } from 'react';
import { TrendingUp, Footprints, Flame } from 'lucide-react';

export function ActivitySummary() {
  const { isConnected } = useGoogleFit();
  const { 
    activities, 
    isLoading, 
    getTodayActivity, 
    loadActivities 
  } = useDailyActivity();

  // Load today's activity on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    loadActivities(today, today);
  }, [loadActivities]);

  const todayActivity = getTodayActivity();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Activity
          </CardTitle>
          <CardDescription>
            Connect Google Fit to see your daily activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Today's Activity
        </CardTitle>
        <CardDescription>
          Your activity for {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Footprints className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Steps</span>
            </div>
            <div className="text-2xl font-bold">
              {todayActivity?.steps.toLocaleString() || '0'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Calories</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(todayActivity?.calories || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
