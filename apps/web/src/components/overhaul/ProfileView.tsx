import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, RefreshCw, Unlink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  initiateGoogleFitConnect,
  disconnectGoogleFit,
  syncGoogleFitNow,
} from "@/lib/googleFitService";

export default function ProfileView() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const googleFit = searchParams.get("googleFit");
    if (!googleFit) return;
    if (googleFit === "connected") {
      toast.success(
        "Google Fit connected! Your activity will sync automatically."
      );
      void updateUserProfile({ googleFitConnected: true });
    } else if (googleFit === "error") {
      toast.error("Could not connect Google Fit. Please try again.");
    }
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = () => {
    if (!currentUser) return;
    initiateGoogleFitConnect(currentUser.uid);
  };

  const handleDisconnect = async () => {
    if (!currentUser) return;
    setIsDisconnecting(true);
    try {
      const idToken = await currentUser.getIdToken();
      await disconnectGoogleFit(idToken);
      await updateUserProfile({ googleFitConnected: false });
      toast.success("Google Fit disconnected.");
    } catch {
      toast.error("Failed to disconnect. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSync = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const idToken = await currentUser.getIdToken();
      await syncGoogleFitNow(idToken);
      await updateUserProfile({});
      await queryClient.invalidateQueries({ queryKey: ["dailyActivityLogs"] });
      toast.success("Sync complete!");
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const connected = Boolean(userProfile?.googleFitConnected);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-2xl space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant font-bold">
            Connected services
          </span>
          <h2 className="font-headline text-2xl font-black mt-1 text-on-surface">
            Google Fit
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-2 max-w-md">
            Sync steps and calories from Google Fit through our secure Render
            API. Connect once; use Sync for an immediate refresh.
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-primary-container/15 border border-primary-container/30">
          <Activity className="w-7 h-7 text-primary-container" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {!connected ? (
          <button
            type="button"
            onClick={handleConnect}
            className="bg-kinetic-gradient text-on-primary-fixed font-headline font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            Connect Google Fit
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 bg-surface-container-highest text-on-surface font-label font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-widest border border-outline-variant/20 hover:bg-surface-bright transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Syncing…" : "Sync now"}
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="inline-flex items-center gap-2 text-error font-label font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-widest border border-error/40 hover:bg-error/10 transition-colors disabled:opacity-50"
            >
              <Unlink className="w-4 h-4" />
              {isDisconnecting ? "Disconnecting…" : "Disconnect"}
            </button>
          </>
        )}
      </div>

      {userProfile?.googleFitLastSync ? (
        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
          Last sync:{" "}
          <span className="text-on-surface normal-case">
            {(() => {
              const v = userProfile.googleFitLastSync as unknown;
              if (v instanceof Date) return v.toLocaleString();
              if (
                v &&
                typeof (v as { toDate?: () => Date }).toDate === "function"
              ) {
                return (v as { toDate: () => Date }).toDate().toLocaleString();
              }
              return String(v);
            })()}
          </span>
        </p>
      ) : null}
    </motion.section>
  );
}
