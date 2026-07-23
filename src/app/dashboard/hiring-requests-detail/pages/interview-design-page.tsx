import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Lock, Clock, ChevronDown } from "lucide-react";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { springSnap, fadeSlideUp } from "@/utils/motion";
import "./pages.css";

interface InterviewSection {
  id: string;
  step: string;
  timeStart: string;
  type: "INTRO" | "Q&A" | "SYSTEM DESIGN" | "SCENARIO" | "CLOSING";
  title: string;
  duration: string;
  description: string;
}

interface CriterionItem {
  id: string;
  title: string;
  instructions: string;
  source: string;
}

type TabKey = "overview" | "criteria" | "context";

const SECTIONS: InterviewSection[] = [
  { id: "s1", step: "01", timeStart: "0:00", type: "INTRO", title: "Standard Professional Introduction", duration: "3 min", description: "Introduce yourself and establish rapport with the candidate." },
  { id: "s2", step: "02", timeStart: "0:03", type: "Q&A", title: "GCP IAM & ADO Integration", duration: "14 min", description: "Evaluate the candidate\u2019s proficiency in GCP IAM governance and secure Azure DevOps CI/CD integration using Workload Identity Federation." },
  { id: "s3", step: "03", timeStart: "0:17", type: "SYSTEM DESIGN", title: "HA & Secure Three-Tier GCP Setup", duration: "15 min", description: "Evaluate the candidate\u2019s ability to design secure, highly available three-tier GCP network topologies, identity controls, and hybrid connectivity solutions." },
  { id: "s4", step: "04", timeStart: "0:32", type: "SCENARIO", title: "Troubleshoot 50% Connection Drops", duration: "15 min", description: "Evaluate the candidate\u2019s ability to diagnose and resolve a 50% packet drop rate using GCP networking and observability tools." },
  { id: "s5", step: "05", timeStart: "0:47", type: "CLOSING", title: "Closing & Candidate Questions", duration: "2 min", description: "Wrap up the interview and answer the candidate questions." },
];

const CRITERIA: CriterionItem[] = [
  { id: "c1", title: "Q&A - GCP IAM Governance", instructions: "Evaluate the candidate\u2019s depth of knowledge in designing and managing GCP IAM. Focus on custom vs predefined roles, principle of least privilege, service account management, and Cloud KMS key rotation.", source: "GCP IAM & ADO Integration" },
  { id: "c2", title: "Q&A - Azure DevOps Integration", instructions: "Assess expertise in securing CI/CD pipelines between Azure DevOps and GCP via Workload Identity Federation (WIF) to eliminate long-lived service account JSON keys.", source: "GCP IAM & ADO Integration" },
  { id: "c3", title: "System Design - Enterprise Networking", instructions: "Assess Shared VPC topology separating Host and Service projects, Google Cloud Load Balancers, avoiding public IP addresses, Private Google Access, and Cloud NAT.", source: "HA & Secure Three-Tier GCP Setup" },
];

interface AccordionGroup {
  id: string;
  title: string;
  items: string[];
}

const TAB_KEYS: { key: TabKey; label: string; badge?: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "criteria", label: "Scoring Criteria" },
  { key: "context", label: "Additional Context", badge: "2" },
];

const CONTEXT_GROUPS: AccordionGroup[] = [
  {
    id: "g1",
    title: "System Design & Architecture",
    items: [
      "Design a three-tier architecture on GCP with highly available and security.",
    ],
  },
  {
    id: "g2",
    title: "Cloud Experience & Integration",
    items: [
      "Check multiple cloud experiences",
      "Ask Azure DevOps connection to GCP environment",
      "Ask Hybrid cloud connectivity for secure network connections.",
    ],
  },
  {
    id: "g3",
    title: "Operations & Deployment",
    items: [
      "Cost Optimizations.",
      "Kubernetes troubleshooting",
      "GKE Cluster upgradations with zero downtime.",
      "Deployment strategies.",
    ],
  },
  {
    id: "g4",
    title: "Troubleshooting & IAM",
    items: [
      "Application intermittent connection error for 50% users.",
      "IAM administrations",
    ],
  },
];

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const InterviewDesignPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  // justification: tracks which accordion groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(CONTEXT_GROUPS.map((g) => g.id)));

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <PageHeader title="Interview Design" />
      <ErrorBoundary>
        <div className="id-page">
          <div className="id-header">
            <div className="id-header-top">
              <div className="id-header-left">
                <h1 className="id-title">Interview Design</h1>
                <span className="id-badge">
                  <Lock className="id-badge-icon" />
                  Read-only
                </span>
              </div>
              <motion.button
                className="id-export-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springSnap}
              >
                <Download className="id-export-icon" />
                <span>Export PDF</span>
              </motion.button>
            </div>

            <div className="id-meta-row">
              <span className="id-meta-pill">
                <Clock className="id-meta-pill-icon" />
                INTERVIEW BRIEF &middot; 49 MIN &middot; 5 SECTIONS
              </span>
            </div>

            <p className="id-objective">
              Evaluate deep architectural design, operations, security and troubleshooting competencies on GCP within 45 minutes.
            </p>

            <div className="id-tabs">
              {TAB_KEYS.map((t) => (
                <button
                  key={t.key}
                  className={`id-tab ${activeTab === t.key ? "id-tab--active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  {t.badge && <span className="id-tab-badge">{t.badge}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="id-content">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  className="id-timeline"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {SECTIONS.map((sec, i) => (
                    <motion.div
                      key={sec.id}
                      className="id-timeline-card"
                      variants={fadeSlideUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="id-timeline-dot">
                        <span className="id-timeline-dot-inner" />
                      </div>
                      <div className="id-timeline-card-body">
                        <div className="id-section-top">
                          <div className="id-section-meta">
                            <span className="id-section-step">{sec.step}. {sec.timeStart}</span>
                            <span className={`id-section-type id-section-type--${sec.type.toLowerCase().replace(/\s+/g, "")}`}>
                              {sec.type}
                            </span>
                          </div>
                          <span className="id-section-duration">{sec.duration}</span>
                        </div>
                        <div className="id-section-body">
                          <h3 className="id-section-title">{sec.title}</h3>
                          <p className="id-section-desc">{sec.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "criteria" && (
                <motion.div
                  key="criteria"
                  className="id-criteria-panel"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="id-criteria-title">Evaluation Criteria ({CRITERIA.length})</h2>
                  <div className="id-criteria-list">
                    {CRITERIA.map((crit) => (
                      <motion.div
                        key={crit.id}
                        className="id-criteria-card"
                        variants={fadeSlideUp}
                        whileHover={{ scale: 1.005 }}
                        transition={springSnap}
                      >
                        <div className="id-criteria-card-top">
                          <h4 className="id-criteria-card-title">{crit.title}</h4>
                          <span className="id-criteria-source">{crit.source}</span>
                        </div>
                        <p className="id-criteria-card-desc">{crit.instructions}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "context" && (
                <motion.div
                  key="context"
                  className="id-context-accordion"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="id-context-accordion-title">Interview Notes &amp; Candidate Context</h2>
                  <p className="id-context-accordion-subtitle">Topics and areas to evaluate during the interview, sourced from the job description.</p>
                  <div className="id-context-groups">
                    {CONTEXT_GROUPS.map((group) => {
                      const isOpen = expandedGroups.has(group.id);
                      return (
                        <div key={group.id} className="id-context-group">
                          <button className="id-context-group-header" onClick={() => toggleGroup(group.id)}>
                            <div className="id-context-group-header-left">
                              <ChevronDown className={`id-context-group-chevron ${isOpen ? "id-context-group-chevron--open" : ""}`} />
                              <span className="id-context-group-title">{group.title}</span>
                            </div>
                            <span className="id-context-group-count">{group.items.length}</span>
                          </button>
                          {isOpen && (
                            <div className="id-context-group-body">
                              <ul className="id-context-group-list">
                                {group.items.map((item, j) => (
                                  <li key={j} className="id-context-group-item">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default InterviewDesignPage;
