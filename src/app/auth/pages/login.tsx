import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { Eye, EyeOff, Mail, Lock, User, Building2, Sparkles, Shield, Zap } from 'lucide-react'

import { useAuth } from '@/app/auth/hooks/use-auth'
import { ROUTES } from '@/constants/routes'
import Logo from '@/components/shared/logo/logo'
import { LOGIN } from './login.constants'
import './login.css'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
  orgName: z.string().optional(),
})

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: { error?: string; detail?: string } } }
    return axiosErr.response?.data?.error || axiosErr.response?.data?.detail || fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}

interface AuthForm {
  email: string
  password: string
  fullName?: string
  orgName?: string
}

const features = [
  { icon: Sparkles, label: 'AI-Powered Candidate Screening' },
  { icon: Shield, label: 'Enterprise-Grade Security' },
  { icon: Zap, label: 'Automated Hiring Workflows' },
]

export default function Login() {
  const { login, loginWithEmail, signup, user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'google' | 'email' | 'signup'>('google')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthForm>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) {
      navigate(ROUTES.CHAT, { replace: true })
    }
  }, [user, navigate])

  const onSuccess = async (response: CredentialResponse) => {
    if (!response.credential || loading) return
    setLoading(true)
    setError('')
    try {
      await login(response.credential)
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Google login failed'))
    } finally {
      setLoading(false)
    }
  }

  const onEmailSubmit = async (data: AuthForm) => {
    if (loading) return
    setError('')

    if (mode === 'email') {
      setLoading(true)
      try {
        await loginWithEmail(data.email, data.password)
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Login failed'))
      } finally {
        setLoading(false)
      }
    } else {
      if (!data.fullName || !data.orgName) {
        setError('Full name and organization name are required')
        return
      }
      setLoading(true)
      try {
        await signup(data.email, data.password, data.fullName ?? '', data.orgName ?? '')
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Sign up failed'))
      } finally {
        setLoading(false)
      }
    }
  }

  const switchMode = (m: 'google' | 'email' | 'signup') => {
    setMode(m)
    setError('')
    reset()
    setShowPassword(false)
  }

  const isSignUp = mode === 'signup'

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-grid" />
        <div className="auth-left-glow" />

        <div className="auth-left-content">
          <div className="auth-left-logo">
            <Logo />
          </div>

          <h1 className="auth-left-title">
            Hire Smarter with
            <br />
            <span className="auth-left-title-bold">webHyre.ai</span>
          </h1>

          <p className="auth-left-subtitle">
            The AI-driven hiring platform that screens, matches, and automates your
            recruitment pipeline — so you can focus on finding the right people.
          </p>

          <div className="auth-left-features">
            {features.map(({ icon: Icon, label }) => (
              <div className="auth-feature-pill" key={label}>
                <Icon size={12} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="auth-left-preview">
            <div className="auth-preview-header">
              <div className="auth-preview-dot" />
              <div className="auth-preview-dot" />
              <div className="auth-preview-dot" />
            </div>
            <div className="auth-preview-body">
              <div className="auth-preview-line auth-preview-line--title" />
              <div className="auth-preview-line auth-preview-line--short" />
              <div className="auth-preview-cards">
                <div className="auth-preview-mini-card">
                  <div className="auth-preview-mini-avatar" />
                  <div className="auth-preview-mini-lines">
                    <div className="auth-preview-line auth-preview-line--sm" />
                    <div className="auth-preview-line auth-preview-line--xs" />
                  </div>
                </div>
                <div className="auth-preview-mini-card">
                  <div className="auth-preview-mini-avatar" />
                  <div className="auth-preview-mini-lines">
                    <div className="auth-preview-line auth-preview-line--sm" />
                    <div className="auth-preview-line auth-preview-line--xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <div className="auth-form-card">
            <div className="auth-right-header">
              <h2 className="auth-form-title">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="auth-form-subtitle">
                {isSignUp
                  ? 'Get started with webHyre.ai in seconds.'
                  : 'Sign in to access your hiring dashboard.'}
              </p>
            </div>

            {loading && mode === 'google' ? (
              <div className="auth-loading">
                <div className="auth-spinner" />
                <p>Signing you in...</p>
              </div>
            ) : (
              <>
                {mode === 'google' ? (
                  <div className="auth-google-section">
                    <div className="auth-google-btn-wrapper">
                      <GoogleLogin
                        onSuccess={onSuccess}
                        onError={() => setError('Google login failed')}
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="pill"
                        width={320}
                      />
                    </div>

                    <div className="auth-divider">
                      <span>or</span>
                    </div>

                    <button
                      type="button"
                      className="auth-btn auth-btn--outline"
                      onClick={() => switchMode('email')}
                    >
                      <Mail size={16} />
                      Sign in with Email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onEmailSubmit)} className="auth-form">
                    {isSignUp && (
                      <>
                        <div className="auth-field">
                          <div className="auth-input-wrap">
                            <User size={16} className="auth-input-icon" />
                            <input
                              {...register('fullName')}
                              type="text"
                              className={`auth-input ${errors.fullName ? 'auth-input--error' : ''}`}
                              placeholder="Full Name"
                            />
                          </div>
                          {errors.fullName && (
                            <span className="auth-field-error">{errors.fullName.message}</span>
                          )}
                        </div>

                        <div className="auth-field">
                          <div className="auth-input-wrap">
                            <Building2 size={16} className="auth-input-icon" />
                            <input
                              {...register('orgName')}
                              type="text"
                              className={`auth-input ${errors.orgName ? 'auth-input--error' : ''}`}
                              placeholder="Organization Name"
                            />
                          </div>
                          {errors.orgName && (
                            <span className="auth-field-error">{errors.orgName.message}</span>
                          )}
                        </div>
                      </>
                    )}

                    <div className="auth-field">
                      <div className="auth-input-wrap">
                        <Mail size={16} className="auth-input-icon" />
                        <input
                          {...register('email')}
                          type="email"
                          className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                          placeholder="you@company.com"
                        />
                      </div>
                      {errors.email && (
                        <span className="auth-field-error">{errors.email.message}</span>
                      )}
                    </div>

                    <div className="auth-field">
                      <div className="auth-input-wrap">
                        <Lock size={16} className="auth-input-icon" />
                        <input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="auth-eye-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <span className="auth-field-error">{errors.password.message}</span>
                      )}
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button
                      type="submit"
                      className="auth-btn auth-btn--primary"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading
                        ? isSignUp ? 'Creating account...' : 'Signing in...'
                        : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>

                    <div className="auth-divider">
                      <span>or</span>
                    </div>

                    <button
                      type="button"
                      className="auth-btn auth-btn--outline"
                      onClick={() => switchMode('google')}
                    >
                      Continue with Google
                    </button>

                    <div className="auth-switch">
                      {isSignUp ? (
                        <>
                          <span>Already have an account?</span>
                          <button type="button" className="auth-link" onClick={() => switchMode('email')}>
                            Sign in
                          </button>
                        </>
                      ) : (
                        <>
                          <span>Don't have an account?</span>
                          <button type="button" className="auth-link" onClick={() => switchMode('signup')}>
                            Create account
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="auth-footer">
            <p>{LOGIN.FOOTER}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
