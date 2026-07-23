import { HelpCircle, UserCheck, Eye, Shield } from "lucide-react";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import "./pages.css";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Recruiter" | "Reviewer" | "account_admin";
}

const MEMBERS: TeamMember[] = [
  { id: "1", name: "shruthi.sp", email: "shruthi.sp@webknot.in", role: "Recruiter" },
  { id: "2", name: "hritika.k", email: "hritika.k@webknot.in", role: "Reviewer" },
  { id: "3", name: "shivaharini", email: "shivaharini@webknot.in", role: "Recruiter" },
  { id: "4", name: "avez", email: "avez@webknot.in", role: "Recruiter" },
  { id: "5", name: "Aditi Tiwari", email: "aditi@recruit41.com", role: "account_admin" },
  { id: "6", name: "Neel Mehta", email: "neel@webknot.in", role: "account_admin" },
  { id: "7", name: "Pranav K Sathish", email: "pranav.ks@webknot.in", role: "account_admin" },
];

const TeamMembersPage = () => {
  const renderRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "Recruiter":
        return (
          <span className="tm-role-badge tm-role-badge--recruiter">
            <UserCheck className="tm-role-badge-icon tm-role-badge-icon--recruiter" />
            Recruiter
          </span>
        );
      case "Reviewer":
        return (
          <span className="tm-role-badge tm-role-badge--reviewer">
            <Eye className="tm-role-badge-icon tm-role-badge-icon--reviewer" />
            Reviewer
          </span>
        );
      case "account_admin":
        return (
          <span className="tm-role-badge tm-role-badge--admin">
            <Shield className="tm-role-badge-icon tm-role-badge-icon--admin" />
            account_admin
          </span>
        );
    }
  };

  return (
    <>
      <ErrorBoundary>
        <div className="tm-page">
          <div className="tm-header-bar">
            <h1 className="tm-heading">Team Members</h1>
            <button className="tm-guide-btn">
              <HelpCircle className="tm-guide-btn-icon" />
              <span>Role Guide</span>
            </button>
          </div>

          <div className="tm-table-shell">
            <table className="tm-table">
              <thead>
                <tr>
                  <th>TEAM MEMBER</th>
                  <th>ROLE</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map((member) => {
                  const initial = member.name[0].toUpperCase();
                  return (
                    <tr key={member.id} className="tm-row">
                      <td className="tm-td-member">
                        <div className="tm-member-cell">
                          <div className="tm-avatar">{initial}</div>
                          <div className="tm-member-info">
                            <span className="tm-member-name">{member.name}</span>
                            <span className="tm-member-email">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="tm-td-role">{renderRoleBadge(member.role)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default TeamMembersPage;
