import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { updateCandidateDetails, type CandidateDetailsUpdatePayload } from "@/services/applications/applications";
import { invalidateHiringRequestQueries } from "@/app/dashboard/hiring-requests-detail/pages/invalidate-hiring-queries";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";
import type { EditCandidateDetailsModalProps } from "./edit-candidate-details-modal.types";
import "./edit-candidate-details-modal.css";

type FormState = {
  phone: string;
  linkedinUrl: string;
  source: string;
  location: string;
  currentCtc: string;
  expectedCtc: string;
  yearsOfExperience: string;
  noticePeriod: string;
  willingToRelocate: boolean;
};

const formFromApplicant = (applicant: Applicant): FormState => ({
  phone: applicant.phone ?? "",
  linkedinUrl: applicant.linkedinUrl ?? "",
  source: applicant.howDidYouHear ?? "",
  location: applicant.location ?? "",
  currentCtc: applicant.currentCtc ?? "",
  expectedCtc: applicant.expectedCtc ?? "",
  yearsOfExperience: applicant.yearsOfExperience ?? "",
  noticePeriod: applicant.noticePeriod ?? "",
  willingToRelocate: applicant.willingToRelocate === true,
});

type EditCandidateFormProps = {
  applicant: Applicant;
  onClose: () => void;
  onSaved?: () => void;
};

const EditCandidateForm = ({ applicant, onClose, onSaved }: EditCandidateFormProps) => {
  const queryClient = useQueryClient();
  // Mounted only while the modal is open, so the form seeds from the applicant once.
  const [form, setForm] = useState<FormState>(() => formFromApplicant(applicant));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    const payload: CandidateDetailsUpdatePayload = {
      phone: form.phone.trim(),
      linkedin_url: form.linkedinUrl.trim(),
      how_did_you_hear: form.source.trim(),
      location: form.location.trim(),
      current_ctc: form.currentCtc.trim(),
      expected_ctc: form.expectedCtc.trim(),
      years_of_experience: form.yearsOfExperience.trim(),
      notice_period: form.noticePeriod.trim(),
      willing_to_relocate: form.willingToRelocate,
    };
    try {
      await updateCandidateDetails(applicant.candidateId, payload);
      await invalidateHiringRequestQueries(queryClient);
      useToastStore.getState().addToast("Candidate details updated", ToastType.SUCCESS);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update candidate details"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="ecd-form" onSubmit={handleSubmit}>
      <p className="ecd-description">
        Update the candidate's basic details. Resume/CV stays as the uploaded file.
      </p>

      <div className="ecd-grid">
        <label className="ecd-label">
          <span className="ecd-label-text">Phone number</span>
          <input
            className="ecd-input"
            type="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="9876543210"
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">LinkedIn</span>
          <input
            className="ecd-input"
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => setField("linkedinUrl", e.target.value)}
            placeholder="https://www.linkedin.com/in/..."
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">Source</span>
          <input
            className="ecd-input"
            value={form.source}
            onChange={(e) => setField("source", e.target.value)}
            placeholder="social_media"
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">Location</span>
          <input
            className="ecd-input"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            placeholder="Pune, Maharashtra, India"
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">Current CTC</span>
          <input
            className="ecd-input"
            value={form.currentCtc}
            onChange={(e) => setField("currentCtc", e.target.value)}
            placeholder="3"
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">Expected CTC</span>
          <input
            className="ecd-input"
            value={form.expectedCtc}
            onChange={(e) => setField("expectedCtc", e.target.value)}
            placeholder="3"
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">Years of Experience</span>
          <input
            className="ecd-input"
            value={form.yearsOfExperience}
            onChange={(e) => setField("yearsOfExperience", e.target.value)}
            placeholder="10"
          />
        </label>

        <label className="ecd-label">
          <span className="ecd-label-text">Notice Period</span>
          <input
            className="ecd-input"
            value={form.noticePeriod}
            onChange={(e) => setField("noticePeriod", e.target.value)}
            placeholder="30"
          />
        </label>
      </div>

      <label className="ecd-checkbox-row">
        <input
          type="checkbox"
          checked={form.willingToRelocate}
          onChange={(e) => setField("willingToRelocate", e.target.checked)}
        />
        Willing to relocate
      </label>

      {error && <p className="ecd-error">{error}</p>}

      <div className="ecd-actions">
        <Button variant="ghost" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSaving} loadingText="Saving...">
          Save changes
        </Button>
      </div>
    </form>
  );
};

const EditCandidateDetailsModal = ({ open, applicant, onClose, onSaved }: EditCandidateDetailsModalProps) => (
  <BaseModal
    open={open}
    onClose={onClose}
    title={`Edit details${applicant?.name ? ` — ${applicant.name}` : ""}`}
    icon="bx bx-edit-alt"
    className="ecd-modal"
  >
    {applicant && (
      <EditCandidateForm
        key={applicant.candidateId}
        applicant={applicant}
        onClose={onClose}
        onSaved={onSaved}
      />
    )}
  </BaseModal>
);

export default EditCandidateDetailsModal;
