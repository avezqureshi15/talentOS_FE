import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import Logo from "@/components/shared/logo/logo";
import { LOGIN } from "./login.constants";
import type { LoginMode } from "./login.types";
import "./login.css";

const Login = () => {
  const { login, loginWithEmail, signup, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<LoginMode>("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      navigate(ROUTES.CHAT, { replace: true });
    }
  }, [user, navigate]);

  const validateEmail = (v: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) return "Email is required";
    if (!re.test(v)) return LOGIN.INVALID_EMAIL;
    return "";
  };

  const validatePassword = (v: string) => {
    if (!v) return "Password is required";
    if (v.length < 8) return LOGIN.PASSWORD_MIN_LENGTH;
    return "";
  };

  const onSuccess = useCallback(async (response: CredentialResponse) => {
    if (!response.credential) return;
    setLoading(true);
    setError("");
    try {
      await login(response.credential);
      navigate(ROUTES.CHAT, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emErr = validateEmail(email);
    const pwErr = validatePassword(password);
    setEmailError(emErr);
    setPasswordError(pwErr);
    if (emErr || pwErr) return;

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate(ROUTES.CHAT, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, password, loginWithEmail, navigate]);

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emErr = validateEmail(email);
    const pwErr = validatePassword(password);
    setEmailError(emErr);
    setPasswordError(pwErr);
    if (emErr || pwErr) return;
    if (!fullName.trim()) { setError("Full name is required"); return; }
    if (!orgName.trim()) { setError("Organization name is required"); return; }

    setLoading(true);
    try {
      await signup(email, password, fullName, orgName);
      navigate(ROUTES.CHAT, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, orgName, signup, navigate]);

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  const renderForm = () => {
    if (mode === "google") {
      return (
        <>
          <div className="login-divider"><span>{LOGIN.SIGN_IN_LABEL}</span></div>

          <div className="login-google-btn-wrapper">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={() => setError("Google login failed")}
              theme="outline"
              size="large"
              text="signin_with"
              shape="pill"
              width={300}
            />
          </div>

          <button
            type="button"
            className="login-email-toggle"
            onClick={() => switchMode("email")}
          >
            Sign in with Email
          </button>
        </>
      );
    }

    if (mode === "email") {
      return (
        <form className="login-form" onSubmit={handleEmailLogin}>
          <div className="login-field">
            <label className="login-label">{LOGIN.EMAIL_LABEL}</label>
            <input
              type="email"
              className={`login-input ${emailError ? "login-input--error" : ""}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="you@company.com"
              autoFocus
            />
            {emailError && <span className="login-field-error">{emailError}</span>}
          </div>

          <div className="login-field">
            <label className="login-label">{LOGIN.PASSWORD_LABEL}</label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={`login-input ${passwordError ? "login-input--error" : ""}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && <span className="login-field-error">{passwordError}</span>}
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? LOGIN.SIGNING_IN_LABEL : LOGIN.SIGN_IN_BTN}
          </button>

          <div className="login-switch">
            <span>{LOGIN.NO_ACCOUNT}</span>
            <button type="button" className="login-link" onClick={() => switchMode("signup")}>
              {LOGIN.SIGN_UP_LINK}
            </button>
          </div>

          <button
            type="button"
            className="login-email-toggle"
            onClick={() => switchMode("google")}
          >
            {LOGIN.GOOGLE_LABEL}
          </button>
        </form>
      );
    }

    return (
      <form className="login-form" onSubmit={handleSignup}>
        <div className="login-field">
          <label className="login-label">{LOGIN.FULL_NAME_LABEL}</label>
          <input
            type="text"
            className="login-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            autoFocus
          />
        </div>

        <div className="login-field">
          <label className="login-label">{LOGIN.ORG_NAME_LABEL}</label>
          <input
            type="text"
            className="login-input"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Acme Inc."
          />
        </div>

        <div className="login-field">
          <label className="login-label">{LOGIN.EMAIL_LABEL}</label>
          <input
            type="email"
            className={`login-input ${emailError ? "login-input--error" : ""}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
            placeholder="you@company.com"
          />
          {emailError && <span className="login-field-error">{emailError}</span>}
        </div>

        <div className="login-field">
          <label className="login-label">{LOGIN.PASSWORD_LABEL}</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className={`login-input ${passwordError ? "login-input--error" : ""}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && <span className="login-field-error">{passwordError}</span>}
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          type="submit"
          className="login-submit"
          disabled={loading}
        >
          {loading ? "Creating account\u2026" : LOGIN.SIGN_UP_BTN}
        </button>

        <div className="login-switch">
          <span>{LOGIN.HAS_ACCOUNT}</span>
          <button type="button" className="login-link" onClick={() => switchMode("email")}>
            {LOGIN.SIGN_IN_LINK}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="login-page">
      <div className="login-card cui-fade-up">
        <div className="login-brand">
          <Logo />
          <p className="login-subtitle">{LOGIN.SUBTITLE}</p>
        </div>

        {loading && mode === "google" ? (
          <div className="login-loader">
            <span className="login-spinner" />
            <p>{LOGIN.SIGNING_IN_LABEL}</p>
          </div>
        ) : (
          renderForm()
        )}

        <p className="login-footer">{LOGIN.FOOTER}</p>
      </div>
    </div>
  );
};

export default Login;
