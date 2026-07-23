import { useCallback, useEffect, useState } from "react";
import { getSettings, updateSettings, type SettingEntry } from "@/app/admin/settings/services/settings.service";
import "./settings-page.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const orgName = settings.find((s) => s.key === "org_name")?.value ?? "";
  const allowedDomains = settings.find((s) => s.key === "allowed_domains")?.value ?? "";

  useEffect(() => {
    setLoading(true);
    getSettings()
      .then(({ data }) => setSettings(data.settings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upsertSetting = (key: string, value: string) => {
    setSettings((prev) => {
      const existing = prev.findIndex((s) => s.key === key);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { key, value };
        return next;
      }
      return [...prev, { key, value }];
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ }
    setSaving(false);
  }, [settings]);

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Organization Settings</h1>
          <p className="settings-subtitle">Manage your organization's configuration</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-field">
          <label className="settings-label">Organization Name</label>
          <input
            type="text"
            className="settings-input"
            value={orgName}
            onChange={(e) => upsertSetting("org_name", e.target.value)}
            placeholder="Your organization name"
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">Allowed Email Domains</label>
          <input
            type="text"
            className="settings-input"
            value={allowedDomains}
            onChange={(e) => upsertSetting("allowed_domains", e.target.value)}
            placeholder="e.g. company.com, org.com"
          />
          <p className="settings-hint">Comma-separated list of email domains allowed to sign up</p>
        </div>

        <div className="settings-actions">
          <button
            className="settings-btn settings-btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
