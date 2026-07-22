import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import "./pages.css";

const ProctoringPage = () => {
  return (
    <>
      <PageHeader title="Proctoring" />
      <ErrorBoundary>
        <div className="tab-placeholder">
          <i className="bx bx-camera tab-placeholder-icon" />
          <h2 className="tab-placeholder-title">Proctoring</h2>
          <p className="tab-placeholder-text">Manage proctoring settings and review session recordings.</p>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default ProctoringPage;
