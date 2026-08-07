import { useEffect, useMemo, useRef, useState } from "react";
import Switch from "@/components/ui/switch/switch";
import Button from "@/components/ui/button/button";
import {
  loadAiScreeningSettings,
  saveAiScreeningSettings,
  type AiScreeningSettings,
} from "@/services/settings/screening-settings";
import "./ai-screening-section.css";

const REGION_OPTIONS = ["IN", "US"];

const AiScreeningSection = () => {
  const [values, setValues] = useState<AiScreeningSettings | null>(null);
  const [saved, setSaved] = useState<AiScreeningSettings | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    void loadAiScreeningSettings().then((s) => {
      if (!mountedRef.current) return;
      setValues(s);
      setSaved(s);
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dirty = useMemo(
    () => !!values && !!saved && JSON.stringify(values) !== JSON.stringify(saved),
    [values, saved],
  );

  const toggleRegion = (region: string) => {
    setFeedback(null);
    setValues((prev) => {
      if (!prev) return prev;
      const has = prev.allowed_phone_regions.includes(region);
      return {
        ...prev,
        allowed_phone_regions: has
          ? prev.allowed_phone_regions.filter((r) => r !== region)
          : [...prev.allowed_phone_regions, region],
      };
    });
  };

  const handleSave = async () => {
    if (!values) return;
    if (values.enforce_phone_geography && values.allowed_phone_regions.length === 0) {
      setFeedback({
        kind: "error",
        text: "Select at least one allowed region before enabling geography enforcement.",
      });
      return;
    }
    setFeedback(null);
    setSaving(true);
    try {
      const next = await saveAiScreeningSettings(values);
      setValues(next);
      setSaved(next);
      setFeedback({
        kind: "success",
        text: "AI screening settings saved and synced to the recruitment hub.",
      });
    } catch {
      setFeedback({ kind: "error", text: "Failed to save AI screening settings." });
    } finally {
      setSaving(false);
    }
  };

  if (!values) {
    return <div className="ai-screening-section__loading">Loading...</div>;
  }

  return (
    <div className="ai-screening-section">
      <div className="ai-screening-section__header">
        <span className="ai-screening-section__title">AI Voice Screening</span>
        <span className="ai-screening-section__subtitle">
          Phone rules and auto-retry used during AI screening calls for this account.
        </span>
      </div>

      <div className="ai-screening-section__body">
        <div className="ai-screening-field">
          <div className="ai-screening-field__head">
            <div>
              <div className="ai-screening-field__label">Voice screening enabled</div>
              <div className="ai-screening-field__hint">Allow AI screening calls to be started.</div>
            </div>
            <Switch
              checked={values.screening_enabled}
              onCheckedChange={(checked) => {
                setFeedback(null);
                setValues((prev) => (prev ? { ...prev, screening_enabled: checked } : prev));
              }}
            />
          </div>
        </div>

        <div className="ai-screening-field">
          <div className="ai-screening-field__head">
            <div>
              <div className="ai-screening-field__label">Enforce phone geography</div>
              <div className="ai-screening-field__hint">
                Only candidates with numbers in an allowed region can be called.
              </div>
            </div>
            <Switch
              checked={values.enforce_phone_geography}
              onCheckedChange={(checked) => {
                setFeedback(null);
                setValues((prev) => (prev ? { ...prev, enforce_phone_geography: checked } : prev));
              }}
            />
          </div>

          <div className="ai-screening-field__regions">
            <div className="ai-screening-field__label">Allowed regions</div>
            <div className="ai-settings-chips">
              {REGION_OPTIONS.map((region) => {
                const active = values.allowed_phone_regions.includes(region);
                return (
                  <button
                    key={region}
                    type="button"
                    className={`ai-settings-chip${active ? " ai-settings-chip--active" : ""}`}
                    aria-pressed={active}
                    onClick={() => toggleRegion(region)}
                  >
                    {region}
                    {active && <i className="bx bx-check" />}
                  </button>
                );
              })}
            </div>
            <div className="ai-screening-field__hint">Supported regions: IN (India), US (United States).</div>
          </div>
        </div>

        <div className="ai-screening-field ai-screening-field--row">
          <div className="ai-screening-field__head">
            <div>
              <div className="ai-screening-field__label">Max call attempts</div>
              <div className="ai-screening-field__hint">Auto-retries before a candidate is flagged.</div>
            </div>
            <input
              className="ai-settings-input ai-settings-input--num"
              type="number"
              min={1}
              max={9}
              value={values.screening_max_retries}
              onChange={(e) => {
                setFeedback(null);
                setValues((prev) =>
                  prev ? { ...prev, screening_max_retries: Number(e.target.value) || 1 } : prev,
                );
              }}
            />
          </div>

          <div className="ai-screening-field__head">
            <div>
              <div className="ai-screening-field__label">Retry delay (seconds)</div>
              <div className="ai-screening-field__hint">Time between automatic retry attempts.</div>
            </div>
            <input
              className="ai-settings-input ai-settings-input--num"
              type="number"
              min={0}
              step={60}
              value={values.screening_retry_delay_seconds}
              onChange={(e) => {
                setFeedback(null);
                setValues((prev) =>
                  prev
                    ? { ...prev, screening_retry_delay_seconds: Math.max(0, Number(e.target.value)) }
                    : prev,
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className="ai-screening-section__footer">
        {feedback && (
          <div className={`ai-screening-section__feedback ai-screening-section__feedback--${feedback.kind}`}>
            {feedback.text}
          </div>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={() => void handleSave()}
          disabled={!dirty || saving}
          loading={saving}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AiScreeningSection;