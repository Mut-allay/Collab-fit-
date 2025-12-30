import { Button } from '@/components/ui/button';
import { useGoogleFit } from '@/hooks/useGoogleFit';
import { apiService } from '@/lib/apiService';
import { Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ManualSyncButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export function ManualSyncButton({ 
  variant = 'outline', 
  size = 'sm',
  showText = true 
}: ManualSyncButtonProps) {
  const { isConnected } = useGoogleFit();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncSuccess, setLastSyncSuccess] = useState(false);

  const handleManualSync = async () => {
    if (!isConnected) {
      toast({
        title: "Google Fit Not Connected",
        description: "Please connect your Google Fit account first.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    setLastSyncSuccess(false);

    try {
      const result = await apiService.syncGoogleFitData();
      
      if (result.success) {
        setLastSyncSuccess(true);
        toast({
          title: "Sync Successful",
          description: `Synced data for ${(result.data as { syncedUsers?: number })?.syncedUsers || 0} users.`,
        });
        
        // Reset success state after 3 seconds
        setTimeout(() => setLastSyncSuccess(false), 3000);
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Failed to sync Google Fit data.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error manually syncing:", err);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleManualSync}
      disabled={isSyncing}
      className="flex items-center gap-2"
    >
      {isSyncing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && "Syncing..."}
        </>
      ) : lastSyncSuccess ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          {showText && "Synced!"}
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          {showText && "Sync Now"}
        </>
      )}
    </Button>
  );
}
