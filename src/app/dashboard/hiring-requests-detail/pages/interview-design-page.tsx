import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import "./pages.css";

const InterviewDesignPage = () => {
  return (
    <>
      <PageHeader title="Interview Design" />
      <ErrorBoundary>
        <div className="tab-placeholder">
          <i className="bx bx-palette tab-placeholder-icon" />
          <h2 className="tab-placeholder-title">Interview Design</h2>
          <p className="tab-placeholder-text">Configure interview rounds and question templates for this position.</p>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default InterviewDesignPage;
