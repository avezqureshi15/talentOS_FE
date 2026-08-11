import BaseModal from "@/components/ui/modal/base-modal";
import type { JdDetailModalProps } from "./jd-detail-modal.types";
import { formatLocations } from "@/utils/format-locations";
import "./jd-detail-modal.css";

const JdDetailModal = ({ open, onClose, hiringRequest }: JdDetailModalProps) => {
  return (
    <BaseModal open={open} onClose={onClose} title={hiringRequest.title} icon="bx bx-briefcase" className="jd-modal-root">
      <div className="jd-modal-body">
        <div className="jd-modal-left">
          <div className="jd-modal-section">
            <h3><i className="bx bx-file" /> Role Overview</h3>
            <p>{hiringRequest.description}</p>
          </div>

          {(hiringRequest.requirements ?? []).length > 0 && (
            <div className="jd-modal-section">
              <h3><i className="bx bx-list-check" /> Requirements</h3>
              <div className="jd-modal-chip-list">
                {(hiringRequest.requirements ?? []).map((req, i) => (
                  <span key={i} className="jd-modal-chip">{req}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="jd-modal-right">
          <div className="jd-modal-section">
            <h3><i className="bx bx-briefcase" /> Job Details</h3>
            <div className="jd-modal-details">
              <div className="jd-modal-detail-item">
                <span className="label"><i className="bx bx-building" /> Department</span>
                <span className="value">{hiringRequest.department}</span>
              </div>
              <div className="jd-modal-detail-item">
                <span className="label"><i className="bx bx-location-pin" /> Location</span>
                <span className="value">{formatLocations(hiringRequest.location)}</span>
              </div>
              <div className="jd-modal-detail-item">
                <span className="label"><i className="bx bx-briefcase" /> Employment</span>
                <span className="value">{hiringRequest.type}</span>
              </div>
              <div className="jd-modal-detail-item">
                <span className="label"><i className="bx bx-check-circle" /> Status</span>
                <span className="value">{hiringRequest.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          {(hiringRequest.benefits ?? []).length > 0 && (
            <div className="jd-modal-section">
              <h3><i className="bx bx-gift" /> Benefits</h3>
              <div className="jd-modal-chip-list">
                {(hiringRequest.benefits ?? []).map((ben, i) => (
                  <span key={i} className="jd-modal-chip">{ben}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default JdDetailModal;
