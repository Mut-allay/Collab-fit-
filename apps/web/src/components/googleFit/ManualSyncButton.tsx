import { Button } from '@/components/ui/button';
import { useGoogleFit } from '@/hooks/useGoogleFit';
import { Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ManualSyncButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export function ManualSyncButton({
  variant = 'outline',
  size = 'sm',
  showText = true,
}: ManualSyncButtonProps) {
  const { isConnected, syncData } = useGoogleFit();
  const [lastSyncSuccess, setLastSyncSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isConnected) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    setLastSyncSuccess(false);
    try {
      await syncData();
      setLastSyncSuccess(true);
      toast.success('Google Fit data synced successfully.');
      setTimeout(() => setLastSyncSuccess(false), 3000);
    } catch {
      toast.error('Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2"
    >
      {isSyncing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && 'Syncing...'}
        </>
      ) : lastSyncSuccess ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          {showText && 'Synced!'}
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          {showText && 'Sync Now'}
        </>
      )}
    </Button>
  );
}
