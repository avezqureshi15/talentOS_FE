import { useMemo, useState } from "react";
import Button from "@/components/ui/button/button";
import { useAuth } from "@/app/auth/hooks/use-auth";
import {
  useApiKeys,
  useManageableApiKeys,
  useUpdateApiKeys,
} from "../hooks/use-api-keys";
import {
  API_KEYS_CLEAR_LABEL,
  API_KEYS_EMPTY_PLACEHOLDER,
  API_KEYS_ERROR_MESSAGE,
  API_KEYS_PAGE_SUBTITLE,
  API_KEYS_PAGE_TITLE,
  API_KEYS_SAVED_MESSAGE,
  API_KEYS_SAVE_LABEL,
  API_KEYS_SOURCE_PLATFORM,
  API_KEYS_SOURCE_PLATFORM_GLOBAL,
  API_KEYS_SOURCE_TENANT,
} from "../api-keys.constants";
import type { ApiKeyEntry } from "../services/api-keys.service";
import type { ManageableApiKeyMeta } from "../services/api-keys.service";
import "./api-keys-section.css";

type Feedback = { kind: "success" | "error"; text: string } | null;

type ApiKeyRowProps = {
  cfg: ManageableApiKeyMeta;
  entry?: ApiKeyEntry;
  value: string;
  hasOverride: boolean;
  onValueChange: (value: string) => void;
  onClear: () => void;
};

const ApiKeyRow = ({ cfg, entry, value, hasOverride, onValueChange, onClear }: ApiKeyRowProps) => {
  const isSecret = cfg.is_secret;
  const placeholder = entry?.value || API_KEYS_EMPTY_PLACEHOLDER;
  const sourceLabel = hasOverride
    ? cfg.scope === "platform"
      ? API_KEYS_SOURCE_PLATFORM_GLOBAL
      : API_KEYS_SOURCE_TENANT
    : API_KEYS_SOURCE_PLATFORM;

  return (
    <div className="api-key-row">
      <div className="api-key-row-icon">
        <i className={cfg.icon} />
      </div>
      <div className="api-key-row-main">
        <div className="api-key-row-head">
          <span className="api-key-row-label">{cfg.label}</span>
          <span className={`api-key-source${hasOverride ? " api-key-source--tenant" : ""}`}>
            {sourceLabel}
          </span>
        </div>
        <div className="api-key-row-hint">{cfg.hint}</div>
        <div className="api-key-row-controls">
          <input
            type={isSecret ? "password" : "text"}
            className="api-key-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {hasOverride && (
            <button type="button" className="api-key-clear" onClick={onClear}>
              {API_KEYS_CLEAR_LABEL}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ApiKeysSection = () => {
  const { user } = useAuth();
  const tenantId = user?.tenant_id ?? undefined;
  const { data, isLoading } = useApiKeys(tenantId);
  const { data: manageableKeys, isLoading: isManageableLoading } = useManageableApiKeys();
  const updateMutation = useUpdateApiKeys(tenantId);

  const [platformValues, setPlatformValues] = useState<Record<string, string>>({});
  const [tenantValues, setTenantValues] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);

  const current = useMemo(() => {
    const map: Record<string, ApiKeyEntry> = {};
    data?.keys.forEach((k) => {
      map[k.key] = k;
    });
    return map;
  }, [data]);

  const platformKeys = useMemo(
    () => (manageableKeys ?? []).filter((m) => m.scope === "platform"),
    [manageableKeys],
  );
  const tenantKeys = useMemo(
    () => (manageableKeys ?? []).filter((m) => m.scope === "tenant"),
    [manageableKeys],
  );

  const dirtyCount = Object.keys(platformValues).length + Object.keys(tenantValues).length;

  const setValue = (
    scope: "platform" | "tenant",
    key: string,
    value: string,
  ) => {
    const setter = scope === "platform" ? setPlatformValues : setTenantValues;
    setter((prev) => {
      const next = { ...prev };
      if (value === "") delete next[key];
      else next[key] = value;
      return next;
    });
    setFeedback(null);
  };

  const markClear = (scope: "platform" | "tenant", key: string) => {
    const setter = scope === "platform" ? setPlatformValues : setTenantValues;
    setter((prev) => ({ ...prev, [key]: "" }));
    setFeedback(null);
  };

  const handleSave = async () => {
    const platformEntries = Object.entries(platformValues).map(([key, value]) => ({
      key,
      value: value.trim(),
    }));
    const tenantEntries = Object.entries(tenantValues).map(([key, value]) => ({
      key,
      value: value.trim(),
    }));
    if (platformEntries.length === 0 && tenantEntries.length === 0) {
      setFeedback({ kind: "error", text: "Nothing to save" });
      return;
    }
    setFeedback(null);
    try {
      const tasks: Promise<unknown>[] = [];
      if (platformEntries.length > 0) {
        tasks.push(updateMutation.mutateAsync({ tenantId: undefined, keys: platformEntries }));
      }
      if (tenantEntries.length > 0 && tenantId !== undefined) {
        tasks.push(updateMutation.mutateAsync({ tenantId, keys: tenantEntries }));
      }
      await Promise.all(tasks);
      setPlatformValues({});
      setTenantValues({});
      setFeedback({ kind: "success", text: API_KEYS_SAVED_MESSAGE });
    } catch {
      setFeedback({ kind: "error", text: API_KEYS_ERROR_MESSAGE });
    }
  };

  return (
    <div className="api-keys-section">
      <div className="api-keys-section__header">
        <span className="api-keys-section__title">{API_KEYS_PAGE_TITLE}</span>
        <span className="api-keys-section__subtitle">{API_KEYS_PAGE_SUBTITLE}</span>
      </div>

      {(isLoading || isManageableLoading) && <div className="api-keys-section__loading">Loading...</div>}

      {!isLoading && !isManageableLoading && (
        <div className="api-keys-section__list">
          <div className="api-keys-section__group">
            <div className="api-keys-section__group-title">Platform (global)</div>
            {platformKeys.map((cfg) => {
              const entry = current[cfg.key];
              return (
                <ApiKeyRow
                  key={cfg.key}
                  cfg={cfg}
                  entry={entry}
                  value={platformValues[cfg.key] ?? ""}
                  hasOverride={entry?.hasOverride ?? false}
                  onValueChange={(v) => setValue("platform", cfg.key, v)}
                  onClear={() => markClear("platform", cfg.key)}
                />
              );
            })}
          </div>

          {tenantId !== undefined && tenantKeys.length > 0 && (
            <div className="api-keys-section__group">
              <div className="api-keys-section__group-title">Tenant override</div>
              {tenantKeys.map((cfg) => {
                const entry = current[cfg.key];
                return (
                  <ApiKeyRow
                    key={cfg.key}
                    cfg={cfg}
                    entry={entry}
                    value={tenantValues[cfg.key] ?? ""}
                    hasOverride={entry?.hasOverride ?? false}
                    onValueChange={(v) => setValue("tenant", cfg.key, v)}
                    onClear={() => markClear("tenant", cfg.key)}
                  />
                );
              })}
            </div>
          )}

          <div className="api-keys-section__footer">
            {feedback && (
              <div className={`api-keys-section__feedback api-keys-section__feedback--${feedback.kind}`}>
                {feedback.text}
              </div>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={dirtyCount === 0 || updateMutation.isPending}
              loading={updateMutation.isPending}
            >
              {API_KEYS_SAVE_LABEL}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeysSection;