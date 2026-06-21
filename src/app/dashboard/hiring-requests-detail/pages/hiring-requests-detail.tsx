import JobDetail from "@/app/dashboard/hiring-requests-detail/components/detail/detail";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";


export default function HiringRequestDetails() {

    return (
        <ErrorBoundary>
            <JobDetail />
        </ErrorBoundary>
    );
}