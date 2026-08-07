import { useEffect, useState } from "react";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { triggerScreeningCall } from "@/services/ai/ai";
import {
  loadAiScreeningSettings,
  type AiScreeningSettings,
} from "@/services/settings/screening-settings";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import { canTriggerScreeningCall } from "./screening-actions.utils";
import "./screening-actions.css";

type ScreeningActionsProps = {
  candidate: Applicant;
  hiringRequestId: string;
  onScreeningTriggered?: () => void;
};

export const ScreeningActions = ({
  candidate,
  hiringRequestId,
  onScreeningTriggered,
}: ScreeningActionsProps) => {
  const toast = useToastStore((s) => s.addToast);
  const [isCalling, setIsCalling] = useState(false);
  const [settings, setSettings] = useState<AiScreeningSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    void loadAiScreeningSettings().then((s) => {
      if (mounted) setSettings(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCallNow = async () => {
    if (isCalling) return;
    setIsCalling(true);
    try {
      await triggerScreeningCall(hiringRequestId, candidate.candidateId);
      toast(`Screening call queued for ${candidate.name}`, ToastType.SUCCESS);
      onScreeningTriggered?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start the screening call";
      toast(message, ToastType.ERROR);
    } finally {
      setIsCalling(false);
    }
  };

  if (!canTriggerScreeningCall(candidate, settings ?? undefined)) return null;

  return (
    <button
      type="button"
      className="call-now-btn"
      onClick={(e) => {
        e.stopPropagation();
        void handleCallNow();
      }}
      disabled={isCalling}
    >
      {isCalling ? (
        <i className="bx bx-loader-alt bx-spin" />
      ) : (
        <i className="bx bx-phone" />
      )}
      {isCalling ? "Calling…" : "Call Now"}
    </button>
  );
};

export default ScreeningActions;