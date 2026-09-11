import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { ADD_CANDIDATE_LIST_REFETCH_DELAY_MS } from "@/constants/constants";
import { addCandidate } from "@/services/hiring-requests/hiring-requests";
import { getApiErrorMessage } from "@/utils/api-error";
import { invalidateHiringRequestQueries } from "@/app/dashboard/hiring-requests-detail/pages/invalidate-hiring-queries";
import ImportCandidatesTab from "@/app/dashboard/hiring-requests-detail/components/import-candidates/import-candidates-tab";
import "./add-candidate-modal.css";

type AddCandidateModalProps = {
  open: boolean;
  onClose: () => void;
  hiringRequestId: string;
};

type FieldKey = "resume";
type FieldErrors = Partial<Record<FieldKey, string>>;
type TabKey = "single" | "bulk";

const MAX_RESUME_BYTES = 2 * 1024 * 1024;

const extractErrorMessage = (err: unknown): string => {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { error?: unknown } } }).response?.data;
    const error = data?.error;
    if (error && typeof error === "object" && "errors" in error) {
      const errors = (error as { errors?: unknown }).errors;
      if (Array.isArray(errors) && errors.every((item) => typeof item === "string")) {
        return errors.join("; ");
      }
    }
  }
  return getApiErrorMessage(err, "Failed to add candidate");
};

const AddCandidateModal = ({ open, onClose, hiringRequestId }: AddCandidateModalProps) => {
  const queryClient = useQueryClient();
  const [referral, setReferral] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState<TabKey>("single");
  const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    };
  }, []);

  const reset = () => {
    setReferral(false);
    setFile(null);
    setFieldErrors({});
    setFormError(null);
  };

  const handleClose = () => {
    reset();
    setTab("single");
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setFieldErrors((prev) => ({ ...prev, resume: undefined }));
    setFormError(null);
    event.target.value = "";
  };

  const scheduleListRefetch = () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      refetchTimerRef.current = null;
      void invalidateHiringRequestQueries(queryClient);
    }, ADD_CANDIDATE_LIST_REFETCH_DELAY_MS);
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!file) {
      errors.resume = "Resume is required";
    } else {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) errors.resume = "Resume must be a PDF";
      else if (file.size > MAX_RESUME_BYTES) errors.resume = "Resume must be 2MB or smaller";
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!hiringRequestId) return;

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await addCandidate(hiringRequestId, { referral, resume: file! });
      scheduleListRefetch();
      useToastStore.getState().addToast("Candidate queued for AI evaluation", ToastType.SUCCESS);
      handleClose();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal open={open} onClose={handleClose} title="Add candidate" icon="bx bx-user-plus" className="add-candidate-modal">
      <div className="acm-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "single"}
          className={`acm-tab${tab === "single" ? " acm-tab--active" : ""}`}
          onClick={() => setTab("single")}
        >
          <i className="bx bx-user-plus" /> Add single candidate
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "bulk"}
          className={`acm-tab${tab === "bulk" ? " acm-tab--active" : ""}`}
          onClick={() => setTab("bulk")}
        >
          <i className="bx bx-upload" /> Bulk upload candidates
        </button>
      </div>

      {tab === "single" ? (
      <form className="acm-form" onSubmit={handleSubmit}>
        <p className="acm-description">
          Upload a PDF resume. The candidate's name, email and phone are parsed automatically and they are queued for AI
          evaluation — no manual entry needed.
        </p>

        <div className="acm-label">
          <span className="acm-label-text">
            Resume
            <span className="acm-required" aria-hidden="true">*</span>
          </span>
          <label className={`acm-dropzone${file ? " acm-dropzone--filled" : ""}`}>
            <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} />
            {file ? (
              <>
                <i className="bx bx-file" />
                <span className="acm-file-name">{file.name}</span>
              </>
            ) : (
              <>
                <i className="bx bx-upload" />
                <span>Click to choose a PDF resume (max 2MB)</span>
              </>
            )}
          </label>
          {fieldErrors.resume && <span className="acm-field-error">{fieldErrors.resume}</span>}
        </div>

        <label className="acm-checkbox-row">
          <input type="checkbox" checked={referral} onChange={(e) => setReferral(e.target.checked)} />
          Mark as referral
        </label>

        {formError && <p className="acm-error">{formError}</p>}

        <div className="acm-actions">
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting} loadingText="Adding...">
            Add candidate
          </Button>
        </div>
      </form>
      ) : (
        <ImportCandidatesTab hiringRequestId={hiringRequestId} onClose={handleClose} />
      )}
    </BaseModal>
  );
};

export default AddCandidateModal;
