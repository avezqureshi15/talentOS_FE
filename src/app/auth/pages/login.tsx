import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/app/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import Logo from "@/components/shared/logo/logo";
import { LOGIN } from "./login.constants";
import "./login.css";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  // Explanation: tracks Google credential exchange so we can show a spinner instead of blank screen
  const [loading, setLoading] = useState(false);

  // Explanation: redirect already-authenticated users away from login page
  useEffect(() => {
    if (user) {
      navigate(ROUTES.CHAT, { replace: true });
    }
  }, [user, navigate]);

  const onSuccess = useCallback(async (response: CredentialResponse) => {
    if (!response.credential) return;
    setLoading(true);
    try {
      await login(response.credential);
      navigate(ROUTES.CHAT, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  return (
    <div className="login-page">
      <div className="login-card cui-fade-up">
        <div className="login-brand">
          <Logo />
          <p className="login-subtitle">{LOGIN.SUBTITLE}</p>
        </div>

        {loading ? (
          <div className="login-loader">
            <span className="login-spinner" />
            <p>{LOGIN.SIGNING_IN_LABEL}</p>
          </div>
        ) : (
          <>
            <div className="login-divider"><span>{LOGIN.SIGN_IN_LABEL}</span></div>

            <div className="login-google-btn-wrapper">
              <GoogleLogin
                onSuccess={onSuccess}
                onError={() => console.error("Google login failed")}
                theme="outline"
                size="large"
                text="signin_with"
                shape="pill"
                width={300}
              />
            </div>
          </>
        )}

        <p className="login-footer">{LOGIN.FOOTER}</p>
      </div>
    </div>
  );
};

export default Login;
