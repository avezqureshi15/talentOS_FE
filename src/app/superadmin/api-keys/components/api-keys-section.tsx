import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/button/button";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { useApiKeys, useUpdateApiKeys } from "../hooks/use-api-keys";
import {
  API_KEYS_CONFIG,
  API_KEYS_CLEAR_LABEL,
  API_KEYS_EMPTY_PLACEHOLDER,
  API_KEYS_ERROR_MESSAGE,
  API_KEYS_PAGE_SUBTITLE,
  API_KEYS_PAGE_TITLE,
  API_KEYS_SAVED_MESSAGE,
  API_KEYS_SAVE_LABEL,
  API_KEYS_SOURCE_PLATFORM,
  API_KEYS_SOURCE_TENANT,
} from "../api-keys.constants";
import type { ApiKeyEntry } from "../services/api-keys.service";
import "./api-keys-section.css";

const ApiKeysSection = () => {
  const { user } = useAuth();
  const tenantId = user?.tenant_id ?? undefined;
  const { data, isLoading } = useApiKeys(tenantId);
  const updateMutation = useUpdateApiKeys(tenantId);

  const [values, setValues] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const current = useMemo(() => {
    const map: Record<string, ApiKeyEntry> = {};
    data?.keys.forEach((k) => { map[k.key] = k; });
    return map;
  }, [data]);

  useEffect(() => {
    setValues({});
  }, [data]);

  const dirtyCount = Object.keys(values).length;

  const handleSave = async () => {
    const entries = Object.entries(values).map(([key, value]) => ({ key, value: value.trim() }));
    if (entries.length === 0) {
      setFeedback({ kind: "error", text: "Nothing to save" });
      return;
    }
    setFeedback(null);
    try {
      await updateMutation.mutateAsync(entries);
      setValues({});
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

      {isLoading && <div className="api-keys-section__loading">Loading...</div>}

      {!isLoading && (
        <div className="api-keys-section__list">
          {API_KEYS_CONFIG.map((cfg) => {
            const entry = current[cfg.key];
            const hasOverride = entry?.hasOverride ?? false;
            const shownValue = values[cfg.key] ?? "";
            const masked = entry?.value ?? "";
            return (
              <div key={cfg.key} className="api-key-row">
                <div className="api-key-row-icon">
                  <i className={cfg.icon} />
                </div>
                <div className="api-key-row-main">
                  <div className="api-key-row-head">
                    <span className="api-key-row-label">{cfg.label}</span>
                    <span className={`api-key-source${hasOverride ? " api-key-source--tenant" : ""}`}>
                      {hasOverride ? API_KEYS_SOURCE_TENANT : API_KEYS_SOURCE_PLATFORM}
                    </span>
                  </div>
                  <div className="api-key-row-hint">{cfg.hint}</div>
                  <div className="api-key-row-controls">
                    <input
                      type="password"
                      className="api-key-input"
                      placeholder={hasOverride ? masked : API_KEYS_EMPTY_PLACEHOLDER}
                      value={shownValue}
                      onChange={(e) => {
                        setValues((prev) => {
                          const next = { ...prev };
                          const v = e.target.value;
                          if (v === "") delete next[cfg.key];
                          else next[cfg.key] = v;
                          return next;
                        });
                        setFeedback(null);
                      }}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {hasOverride && (
                      <button
                        type="button"
                        className="api-key-clear"
                        onClick={() => {
                          setValues((prev) => {
                            const next = { ...prev };
                            delete next[cfg.key];
                            return next;
                          });
                        }}
                      >
                        {API_KEYS_CLEAR_LABEL}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

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
