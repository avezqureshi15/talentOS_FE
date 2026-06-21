import Table from "@/app/dashboard/hiring-requests/components/table/table"
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary"

const HiringRequests = () => {
  return (
    <ErrorBoundary>
      <Table/>
    </ErrorBoundary>
  )
}

export default HiringRequests