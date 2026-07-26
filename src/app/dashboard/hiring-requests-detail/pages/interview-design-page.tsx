import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Lock, Clock, ChevronDown } from "lucide-react";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { springSnap, fadeSlideUp } from "@/utils/motion";
import "./pages.css";

interface Topic {
  id: string;
  title: string;
  subtopics: string[];
}

interface InterviewSection {
  id: string;
  step: string;
  timeStart: string;
  type: "INTRO" | "Q&A" | "SYSTEM DESIGN" | "SCENARIO" | "CLOSING";
  title: string;
  duration: string;
  description: string;
  topics?: Topic[];
  depth?: string;
  criteriaIds?: string[];
  questions?: string[];
}

interface CriterionItem {
  id: string;
  title: string;
  instructions: string;
  source: string;
}

type TabKey = "overview" | "criteria" | "context";

const SECTIONS: InterviewSection[] = [
  {
    id: "s1",
    step: "01",
    timeStart: "0:00",
    type: "INTRO",
    title: "Standard Professional Introduction",
    duration: "3 min",
    description: "Introduce yourself and establish rapport with the candidate.",
  },
  {
    id: "s2",
    step: "02",
    timeStart: "0:03",
    type: "Q&A",
    title: "GCP IAM & ADO Integration",
    duration: "14 min",
    description:
      "Evaluate the candidate\u2019s proficiency in GCP IAM governance and secure Azure DevOps CI/CD integration using Workload Identity Federation.",
    depth: "Deep Dive",
    topics: [
      {
        id: "t1",
        title: "GCP IAM Governance",
        subtopics: [
          "IAM Roles & Permissions",
          "KMS & Key Management",
          "Service Accounts & Least Privilege",
        ],
      },
      {
        id: "t2",
        title: "Azure DevOps Integration",
        subtopics: [
          "Workload Identity Federation",
          "Secure Connection from Azure DevOps",
          "CI/CD Pipeline Security",
        ],
      },
    ],
    criteriaIds: ["c1", "c2"],
    questions: [
      "Explain the difference between primitive, predefined, and custom IAM roles. When would you choose custom over predefined?",
      "How does Workload Identity Federation eliminate the need for service account keys in CI/CD pipelines?",
      "Describe the principle of least privilege in the context of GCP service accounts. How do you implement it at scale?",
      "Walk through setting up a secure connection from Azure DevOps to GCP using Workload Identity Federation.",
    ],
  },
  {
    id: "s3",
    step: "03",
    timeStart: "0:17",
    type: "SYSTEM DESIGN",
    title: "HA & Secure Three-Tier GCP Setup",
    duration: "15 min",
    description:
      "Evaluate the candidate\u2019s ability to design secure, highly available three-tier GCP network topologies, identity controls, and hybrid connectivity solutions.",
    depth: "Deep Dive",
    topics: [
      {
        id: "t3",
        title: "Network Architecture",
        subtopics: [
          "Shared VPC Topology",
          "Cloud Load Balancing",
          "Private Google Access",
        ],
      },
      {
        id: "t4",
        title: "Security Controls",
        subtopics: [
          "Cloud Armor & WAF",
          "IAM & Service Accounts",
          "Cloud NAT",
        ],
      },
    ],
    criteriaIds: ["c3"],
    questions: [
      "Design a three-tier web application on GCP with high availability across two regions. What networking and load balancing components would you use?",
      "How would you secure the architecture to ensure no public IP addresses are used for backend instances?",
      "Explain the Shared VPC model and how you would separate Host and Service projects.",
      "What strategies would you use to protect against DDoS attacks at the application and network layers?",
    ],
  },
  {
    id: "s4",
    step: "04",
    timeStart: "0:32",
    type: "SCENARIO",
    title: "Troubleshoot 50% Connection Drops",
    duration: "15 min",
    description:
      "Evaluate the candidate\u2019s ability to diagnose and resolve a 50% packet drop rate using GCP networking and observability tools.",
    questions: [
      "A production application is experiencing 50% connection drops. What tools and steps would you use in GCP to diagnose the issue?",
      "How would you use VPC Flow Logs and Packet Mirroring to identify the source of packet loss?",
      "If the drops are caused by a misconfigured firewall rule, how would you trace and fix it without causing downtime?",
      "What metrics and logs would you monitor in Cloud Monitoring to detect this class of issue proactively?",
    ],
  },
  {
    id: "s5",
    step: "05",
    timeStart: "0:47",
    type: "CLOSING",
    title: "Closing & Candidate Questions",
    duration: "2 min",
    description: "Wrap up the interview and answer the candidate questions.",
    questions: [
      "Summarise the candidate\u2019s key strengths and areas for improvement observed during the interview.",
      "Invite the candidate to ask questions about the role, team, or technical environment.",
    ],
  },
];

const CRITERIA: CriterionItem[] = [
  {
    id: "c1",
    title: "Q&A - GCP IAM Governance",
    instructions:
      "Evaluate the candidate\u2019s depth of knowledge in designing and managing GCP IAM. Focus on custom vs predefined roles, principle of least privilege, service account management, and Cloud KMS key rotation.",
    source: "GCP IAM & ADO Integration",
  },
  {
    id: "c2",
    title: "Q&A - Azure DevOps Integration",
    instructions:
      "Assess expertise in securing CI/CD pipelines between Azure DevOps and GCP via Workload Identity Federation (WIF) to eliminate long-lived service account JSON keys.",
    source: "GCP IAM & ADO Integration",
  },
  {
    id: "c3",
    title: "System Design - Enterprise Networking",
    instructions:
      "Assess Shared VPC topology separating Host and Service projects, Google Cloud Load Balancers, avoiding public IP addresses, Private Google Access, and Cloud NAT.",
    source: "HA & Secure Three-Tier GCP Setup",
  },
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set()
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(CONTEXT_GROUPS.map((g) => g.id))
  );
  const [expandedCrits, setExpandedCrits] = useState<Set<string>>(
    () => new Set()
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCrit = (id: string) => {
    setExpandedCrits((prev) => {
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
              Evaluate deep architectural design, operations, security and
              troubleshooting competencies on GCP within 45 minutes.
            </p>

            <div className="id-tabs">
              {TAB_KEYS.map((t) => (
                <button
                  key={t.key}
                  className={`id-tab ${
                    activeTab === t.key ? "id-tab--active" : ""
                  }`}
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
                  {SECTIONS.map((sec, i) => {
                    const isOpen = expandedSections.has(sec.id);
                    return (
                      <motion.div
                        key={sec.id}
                        className={`id-timeline-card${
                          isOpen ? " id-timeline-card--open" : ""
                        }`}
                        variants={fadeSlideUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="id-timeline-dot">
                          <span className="id-timeline-dot-inner" />
                        </div>
                        <div className="id-timeline-card-body">
                          <button
                            className="id-timeline-card-header"
                            onClick={() => toggleSection(sec.id)}
                          >
                            <div className="id-section-top">
                              <div className="id-section-meta">
                                <span className="id-section-step">
                                  {sec.step}. {sec.timeStart}
                                </span>
                                <span
                                  className={`id-section-type id-section-type--${sec.type
                                    .toLowerCase()
                                    .replace(/\s+/g, "")}`}
                                >
                                  {sec.type}
                                </span>
                              </div>
                              <div className="id-section-top-right">
                                <span className="id-section-duration">
                                  {sec.duration}
                                </span>
                                <ChevronDown
                                  className={`id-section-chevron${
                                    isOpen
                                      ? " id-section-chevron--open"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="id-section-body">
                              <h3 className="id-section-title">{sec.title}</h3>
                              <p className="id-section-desc">
                                {sec.description}
                              </p>
                            </div>
                          </button>

                          {isOpen && (
                            <motion.div
                              className="id-section-expanded"
                              variants={contentVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="id-section-divider" />

                              {sec.questions && sec.questions.length > 0 && (
                                <div className="id-questions">
                                  <h4 className="id-questions-heading">
                                    Questions
                                  </h4>
                                  <ol className="id-questions-list">
                                    {sec.questions.map((q, j) => (
                                      <li key={j} className="id-question">
                                        {q}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {sec.topics && (
                                <div className="id-topics">
                                  <h4 className="id-topics-heading">Topics</h4>
                                  <ol className="id-topics-list">
                                    {sec.topics.map((topic) => (
                                      <li key={topic.id} className="id-topic">
                                        <span className="id-topic-title">
                                          {topic.title}
                                        </span>
                                        <ul className="id-topic-subtopics">
                                          {topic.subtopics.map((st, j) => (
                                            <li key={j} className="id-topic-subtopic">
                                              {st}
                                            </li>
                                          ))}
                                        </ul>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {sec.depth && (
                                <div className="id-section-depth">
                                  <span className="id-depth-label">
                                    Assessment depth:
                                  </span>
                                  <span className="id-depth-value">
                                    {sec.depth}
                                  </span>
                                </div>
                              )}

                              {sec.criteriaIds && sec.criteriaIds.length > 0 && (
                                <div className="id-section-criteria">
                                  <h4 className="id-section-criteria-heading">
                                    Evaluation criteria
                                  </h4>
                                  <ol className="id-section-criteria-list">
                                    {sec.criteriaIds.map((cid, idx) => {
                                      const crit = CRITERIA.find(
                                        (c) => c.id === cid
                                      );
                                      if (!crit) return null;
                                      const isCritOpen =
                                        expandedCrits.has(crit.id);
                                      const shouldTruncate =
                                        crit.instructions.length > 100;
                                      const visible = isCritOpen
                                        ? crit.instructions
                                        : shouldTruncate
                                          ? crit.instructions.slice(0, 100)
                                          : crit.instructions;
                                      return (
                                        <li
                                          key={crit.id}
                                          className="id-section-criterion"
                                        >
                                          <span className="id-section-criterion-title">
                                            {idx + 1}. {crit.title}
                                          </span>
                                          <p className="id-section-criterion-desc">
                                            {visible}
                                            {shouldTruncate && (
                                              <button
                                                className="id-read-more-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleCrit(crit.id);
                                                }}
                                              >
                                                {isCritOpen
                                                  ? " Read less"
                                                  : " Read more"}
                                              </button>
                                            )}
                                          </p>
                                        </li>
                                      );
                                    })}
                                  </ol>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
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
                  <h2 className="id-criteria-title">
                    Evaluation Criteria ({CRITERIA.length})
                  </h2>
                  <div className="id-criteria-list">
                    {CRITERIA.map((crit) => {
                      const isCritOpen = expandedCrits.has(crit.id);
                      const shouldTruncate = crit.instructions.length > 100;
                      const visible = isCritOpen
                        ? crit.instructions
                        : shouldTruncate
                          ? crit.instructions.slice(0, 100)
                          : crit.instructions;
                      return (
                        <motion.div
                          key={crit.id}
                          className="id-criteria-card"
                          variants={fadeSlideUp}
                          whileHover={{ scale: 1.005 }}
                          transition={springSnap}
                        >
                          <div className="id-criteria-card-top">
                            <h4 className="id-criteria-card-title">
                              {crit.title}
                            </h4>
                            <span className="id-criteria-source">
                              {crit.source}
                            </span>
                          </div>
                          <p className="id-criteria-card-desc">
                            {visible}
                            {shouldTruncate && (
                              <button
                                className="id-read-more-btn"
                                onClick={() => toggleCrit(crit.id)}
                              >
                                {isCritOpen ? " Read less" : " Read more"}
                              </button>
                            )}
                          </p>
                        </motion.div>
                      );
                    })}
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
                  <h2 className="id-context-accordion-title">
                    Interview Notes &amp; Candidate Context
                  </h2>
                  <p className="id-context-accordion-subtitle">
                    Topics and areas to evaluate during the interview, sourced
                    from the job description.
                  </p>
                  <div className="id-context-groups">
                    {CONTEXT_GROUPS.map((group) => {
                      const isOpen = expandedGroups.has(group.id);
                      return (
                        <div key={group.id} className="id-context-group">
                          <button
                            className="id-context-group-header"
                            onClick={() => toggleGroup(group.id)}
                          >
                            <div className="id-context-group-header-left">
                              <ChevronDown
                                className={`id-context-group-chevron ${
                                  isOpen
                                    ? "id-context-group-chevron--open"
                                    : ""
                                }`}
                              />
                              <span className="id-context-group-title">
                                {group.title}
                              </span>
                            </div>
                            <span className="id-context-group-count">
                              {group.items.length}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="id-context-group-body">
                              <ul className="id-context-group-list">
                                {group.items.map((item, j) => (
                                  <li key={j} className="id-context-group-item">
                                    {item}
                                  </li>
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
