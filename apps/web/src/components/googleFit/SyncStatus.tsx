import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleFit } from '@/hooks/useGoogleFit';
import { ManualSyncButton } from './ManualSyncButton';
import { Clock } from 'lucide-react';

interface SyncStatusProps {
  showSyncButton?: boolean;
}

export function SyncStatus({ showSyncButton = true }: SyncStatusProps) {
  const { isConnected, lastSyncTime } = useGoogleFit();

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
      <CardContent className="space-y-3">
        {showSyncButton && (
          <>
            <ManualSyncButton 
              variant="outline" 
              size="sm" 
              showText={true}
            />
            <div className="text-xs text-muted-foreground text-center">
              Automatic sync runs daily at noon UTC
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
