import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import httpClient from "@/services/http-client";
import type { InviteInfo } from "./accept-invite.types";
import "./accept-invite.css";

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const { loginWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(ROUTES.CHAT, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!token) return;
    httpClient.get<InviteInfo>(`${API_ENDPOINTS.AUTH_INVITES}/${token}`)
      .then(({ data }) => setInvite(data))
      .catch((err) => setError(err?.response?.data?.detail ?? "Invite is invalid or expired"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || password.length < 8) return;

    setSubmitting(true);
    setError("");
    try {
      await httpClient.post(API_ENDPOINTS.AUTH_ACCEPT_INVITE, {
        token,
        password,
        full_name: fullName.trim(),
      });
      loginWithEmail(invite!.email, password);
      navigate(ROUTES.CHAT, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Failed to accept invite");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-page">
        <div className="ai-card">
          <p className="ai-loading">Verifying invite...</p>
        </div>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="ai-page">
        <div className="ai-card">
          <div className="ai-error">{error}</div>
          <button className="ai-btn ai-btn--primary" onClick={() => navigate(ROUTES.LOGIN)}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-page">
      <div className="ai-card">
        <div className="ai-brand">{invite?.org_name}</div>
        <p className="ai-subtitle">
          You've been invited as <strong>{invite?.role}</strong>
        </p>
        <p className="ai-email">{invite?.email}</p>

        <form onSubmit={handleSubmit} className="ai-form">
          {error && <div className="ai-error">{error}</div>}

          <div className="ai-field">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="ai-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="ai-btn ai-btn--primary ai-btn--full"
            disabled={submitting}
          >
            {submitting ? "Accepting..." : "Accept Invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
