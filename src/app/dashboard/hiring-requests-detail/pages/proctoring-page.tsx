import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Shield, ScanFace, Monitor, Layers, Smartphone, FileText, Eye, Pencil, CheckCircle, Sparkles } from "lucide-react";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import Switch from "@/components/ui/switch/switch";
import { springSnap, fadeSlideUp, staggerContainer } from "@/utils/motion";
import "./pages.css";

interface ProctoringRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  badge?: string;
  disabled?: boolean;
}

const INSTRUCTIONS = [
  "Candidate must ensure their face is clearly visible throughout the interview.",
  "Screen sharing must remain active — pausing or hiding the tab will trigger a warning.",
  "Only one monitor is permitted. External displays must be disconnected before starting.",
];

const ProctoringPage = () => {
  const [rules, setRules] = useState<ProctoringRule[]>([
    { id: "lockdown", title: "Lockdown Browser", description: "Candidate must download TalentOS\u2019s secure desktop app. It kills blacklisted software (even those hidden from screen share) and prevents window or screen switching. Available on macOS and Windows.", enabled: false },
    { id: "face_visibility", title: "Candidate Face Visibility", description: "Candidate will receive a 30s warning if their face is hidden or multiple faces appear. Interview ends if not resolved.", enabled: true },
    { id: "screen_share", title: "Require Screen Share", description: "Candidate must share their full screen. A 30s warning appears if sharing stops. Interview ends if not resumed.", enabled: true },
    { id: "multiple_monitors", title: "Block Multiple Monitors", description: "Candidate must disconnect external monitors before starting. A 30s warning appears if one is connected during the interview.", enabled: true },
    { id: "mobile_restrict", title: "Restrict Mobile Browsers", description: "This interview will be blocked on mobile phones. Candidates can only take it on a desktop or laptop.", enabled: true, badge: "Auto-enabled by Screen Share", disabled: true },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id && !r.disabled ? { ...r, enabled: !r.enabled } : r)));
  };

  const gridRules = rules.filter((r) => r.id !== "lockdown");

  return (
    <>
      <PageHeader title="Proctoring" />
      <ErrorBoundary>
        <motion.div className="proctoring-page" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="proctoring-header" variants={fadeSlideUp}>
            <h1 className="proctoring-title">Proctoring Settings</h1>
            <p className="proctoring-subtitle">
              Configure automated security and proctoring rules for candidate assessments.
            </p>
          </motion.div>

          {/* ─── SECTION 1: SETTINGS ─── */}
          <motion.div className="proctoring-card-section" variants={fadeSlideUp}>
            <div className="proctoring-section-head">
              <Settings className="proctoring-section-icon" />
              <div>
                <h2 className="proctoring-section-title">Settings</h2>
                <p className="proctoring-section-desc">These settings control what candidates must do during the interview.</p>
              </div>
            </div>

            <motion.div
              className="proctoring-hero-card"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              transition={springSnap}
            >
              <div className="proctoring-hero-left">
                <div className="proctoring-icon-box">
                  <Shield className="proctoring-icon-box-icon" />
                </div>
                <div>
                  <h3 className="proctoring-hero-title">Lockdown Browser</h3>
                  <p className="proctoring-hero-desc">Candidate must download TalentOS&rsquo;s secure desktop app. It kills blacklisted software (even those hidden from screen share) and prevents window or screen switching. Available on macOS and Windows.</p>
                </div>
              </div>
              <Switch
                checked={rules.find((r) => r.id === "lockdown")!.enabled}
                onCheckedChange={() => toggleRule("lockdown")}
              />
            </motion.div>

            <div className="proctoring-grid">
              {gridRules.map((rule) => {
                const iconMap: Record<string, typeof ScanFace> = {
                  face_visibility: ScanFace,
                  screen_share: Monitor,
                  multiple_monitors: Layers,
                  mobile_restrict: Smartphone,
                };
                const Icon = iconMap[rule.id] || Shield;
                return (
                  <motion.div
                    key={rule.id}
                    className="proctoring-grid-card"
                    variants={fadeSlideUp}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={springSnap}
                  >
                    <div className="proctoring-grid-card-top">
                      <div className="proctoring-icon-box">
                        <Icon className="proctoring-icon-box-icon" />
                      </div>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                        disabled={rule.disabled}
                      />
                    </div>
                    <div className="proctoring-grid-card-title-row">
                      <h3 className="proctoring-grid-card-title">{rule.title}</h3>
                      {rule.badge && <span className="proctoring-grid-badge">{rule.badge}</span>}
                    </div>
                    <p className="proctoring-grid-card-desc">{rule.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ─── SECTION 2: PRE-INTERVIEW INSTRUCTIONS ─── */}
          <motion.div className="proctoring-card-section" variants={fadeSlideUp}>
            <div className="proctoring-section-head">
              <FileText className="proctoring-section-icon" />
              <div className="proctoring-section-head-row">
                <div>
                  <h2 className="proctoring-section-title">Pre-Interview Instructions</h2>
                  <p className="proctoring-section-desc">Shown before the interview starts and included in the invitation email.</p>
                </div>
                <div className="proctoring-section-tag">visible to candidates</div>
              </div>
            </div>

            <div className="proctoring-section-actions">
              <motion.button className="proctoring-action-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={springSnap}>
                <Eye className="proctoring-action-btn-icon" /> Candidate View
              </motion.button>
              <motion.button className="proctoring-action-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={springSnap}>
                <Pencil className="proctoring-action-btn-icon" /> Edit
              </motion.button>
            </div>

            <div className="proctoring-instruction-list">
              {INSTRUCTIONS.map((text, i) => (
                <motion.div
                  key={i}
                  className="proctoring-instruction-card"
                  variants={fadeSlideUp}
                  whileHover={{ scale: 1.005 }}
                  transition={springSnap}
                >
                  <div className="proctoring-instruction-left">
                    <span className="proctoring-instruction-num">{i + 1}</span>
                    <span className="proctoring-instruction-text">{text}</span>
                  </div>
                  <span className="proctoring-instruction-tag">from settings</span>
                </motion.div>
              ))}
            </div>

            <p className="proctoring-footer-note">Maximum 5 instructions allowed. 3 of 5 used &mdash; Proctoring settings may add up to 3 automatically, remaining slots are yours to customise.</p>
          </motion.div>

          {/* ─── SECTION 3: POST-INTERVIEW AI PROCTORING ─── */}
          <motion.div className="proctoring-card-section" variants={fadeSlideUp}>
            <div className="proctoring-section-head">
              <Sparkles className="proctoring-section-icon" />
              <div className="proctoring-section-head-row">
                <div>
                  <h2 className="proctoring-section-title">Post-Interview AI Proctoring</h2>
                  <p className="proctoring-section-desc">Automated analysis of candidate behaviour during the interview.</p>
                </div>
                <motion.div className="proctoring-status-badge" whileHover={{ scale: 1.04 }} transition={springSnap}>
                  <CheckCircle className="proctoring-status-icon" />
                  Enabled
                </motion.div>
              </div>
            </div>

            <p className="proctoring-ai-body">
              Our AI proctor analyses candidate behaviour across 20+ signals including gaze patterns, lip sync, background audio, screen activity, and keystroke rhythms. A detailed trust score is generated after the interview for review.
            </p>
          </motion.div>
        </motion.div>
      </ErrorBoundary>
    </>
  );
};

export default ProctoringPage;
