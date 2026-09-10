import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { ADD_CANDIDATE_LIST_REFETCH_DELAY_MS } from "@/constants/constants";
import { addCandidate } from "@/services/hiring-requests/hiring-requests";
import { getApiErrorMessage } from "@/utils/api-error";
import { isValidEmail, isValidPhone } from "@/utils/validation";
import { invalidateHiringRequestQueries } from "@/app/dashboard/hiring-requests-detail/pages/invalidate-hiring-queries";
import "./add-candidate-modal.css";

type AddCandidateModalProps = {
  open: boolean;
  onClose: () => void;
  hiringRequestId: string;
};

type FieldKey = "name" | "email" | "phone" | "resume";
type FieldErrors = Partial<Record<FieldKey, string>>;

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referral, setReferral] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    };
  }, []);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setReferral(false);
    setFile(null);
    setFieldErrors({});
    setFormError(null);
  };

  const handleClose = () => {
    reset();
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
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) errors.name = "Name is required";
    if (!trimmedEmail) errors.email = "Email is required";
    else if (!isValidEmail(trimmedEmail)) errors.email = "Enter a valid email address";
    if (!trimmedPhone) errors.phone = "Phone is required";
    else if (!isValidPhone(trimmedPhone)) errors.phone = "Enter a 10-digit mobile number starting with 6, 7, 8, or 9";
    if (!file) errors.resume = "Resume is required";
    else {
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
      await addCandidate(hiringRequestId, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        referral,
        resume: file!,
      });
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
      <form className="acm-form" onSubmit={handleSubmit}>
        <p className="acm-description">
          Add one person with a PDF resume. They are queued for AI evaluation the same way as a careers application.
        </p>

        <label className="acm-label">
          <span className="acm-label-text">
            Name
            <span className="acm-required" aria-hidden="true">*</span>
          </span>
          <input
            className="acm-input"
            value={name}
            onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
            autoFocus
          />
          {fieldErrors.name && <span className="acm-field-error">{fieldErrors.name}</span>}
        </label>

        <label className="acm-label">
          <span className="acm-label-text">
            Email
            <span className="acm-required" aria-hidden="true">*</span>
          </span>
          <input
            className="acm-input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
          />
          {fieldErrors.email && <span className="acm-field-error">{fieldErrors.email}</span>}
        </label>

        <label className="acm-label">
          <span className="acm-label-text">
            Phone
            <span className="acm-required" aria-hidden="true">*</span>
          </span>
          <input
            className="acm-input"
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); }}
            placeholder="9876543210"
          />
          {fieldErrors.phone && <span className="acm-field-error">{fieldErrors.phone}</span>}
        </label>

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
    </BaseModal>
  );
};

export default AddCandidateModal;
