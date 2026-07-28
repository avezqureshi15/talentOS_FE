import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AlertsComponent from "@/app/dashboard/hiring-requests/components/alerts/alerts";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import PageHeader from "@/layouts/protected-layouts/components/header/page-header";
import { ALERTS_TABS, ALERTS_CHIP_LABEL, ALERTS_DESCRIPTION } from "@/constants/constants";
import { spring, springSoft, fadeSlideUp, slideInLeft } from "@/utils/motion";
import "./alerts.css";

const Alerts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sub = searchParams.get("sub") || "slots";

  const setSub = (key: string) => setSearchParams({ sub: key });

  return (
    <>
      <PageHeader title="Alerts" titleIcon="bx bx-bell" />
      <ErrorBoundary>
        <motion.div
          className="alerts-page"
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={spring}
        >
          <div className="ac-content">
            <motion.div
              className="ac-info-card"
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              transition={{ ...springSoft, delay: 0.05 }}
            >
              <span className="ac-info-chip"><i className="bx bx-info-circle" /> {ALERTS_CHIP_LABEL}</span>
              <span className="ac-info-text">{ALERTS_DESCRIPTION}</span>
            </motion.div>
            <div className="ac-tabs">
              {ALERTS_TABS.map((st) => (
                <motion.button
                  key={st.key}
                  className={`ac-tab${sub === st.key ? " ac-tab--active" : ""}`}
                  onClick={() => setSub(st.key)}
                  type="button"
                  whileHover={{ color: "var(--text-primary)" }}
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                >
                  <i className={st.icon} />
                  {st.label}
                </motion.button>
              ))}
            </div>
            <AlertsComponent sub={sub as "slots" | "reviews"} />
          </div>
        </motion.div>
      </ErrorBoundary>
    </>
  );
};

export default Alerts;
