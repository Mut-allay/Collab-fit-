import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGoogleFit } from '@/hooks/useGoogleFit';
import { Loader2, RefreshCw, Clock } from 'lucide-react';

interface SyncStatusProps {
  showSyncButton?: boolean;
}

export function SyncStatus({ showSyncButton = true }: SyncStatusProps) {
  const { isConnected, lastSyncTime, isLoading, syncData } = useGoogleFit();

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Sync Status
        </CardTitle>
        <CardDescription>
          Last sync: {formatLastSync(lastSyncTime)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSyncButton && (
          <Button
            variant="outline"
            onClick={syncData}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
