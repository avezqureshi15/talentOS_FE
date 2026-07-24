import { Icon } from "@/components/ui/icons";
import type { RateHeaderProps } from "./rate-header.types";
import "./rate-header.css";

const RateHeader = ({ meta, title, subtitle, guidelines }: RateHeaderProps) => {
  const candidate = meta.candidate?.trim() || "Candidate";
  const round = meta.round?.trim() || "Interview";

  return (
    <header className="rate-header">
      <div className="rate-header__top">
        <div className="rate-header__brand">
          <Icon.Logo />
        </div>
        <div className="rate-header__titles">
          <h1 className="rate-header__title">{title}</h1>
          <span className="rate-header__subtitle">{subtitle}</span>
        </div>
      </div>

      <div className="rate-header__identity">
        <span className="rate-header__badge">{round}</span>
        <h2 className="rate-header__name">{candidate}</h2>
        <div className="rate-header__meta">
          {meta.role && (
            <span className="rate-header__meta-item">
              <i className="bx bx-briefcase" aria-hidden />
              {meta.role}
            </span>
          )}
          {meta.interviewedOn && (
            <span className="rate-header__meta-item">
              <i className="bx bx-calendar" aria-hidden />
              Interviewed: {meta.interviewedOn}
            </span>
          )}
          {meta.interviewer && (
            <span className="rate-header__meta-item">
              <i className="bx bx-user" aria-hidden />
              Interviewer: {meta.interviewer}
            </span>
          )}
        </div>
        {guidelines && (
          <p className="rate-header__guidelines">
            <i className="bx bx-info-circle" aria-hidden />
            {guidelines}
          </p>
        )}
      </div>
    </header>
  );
};

export default RateHeader;
