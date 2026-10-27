import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../auth';
import './LoginPage.css';

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username: string;
  password: string;
}

const EMPTY_ERRORS: FormErrors = { username: '', password: '' };

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = { ...EMPTY_ERRORS };
    let valid = true;

    if (!formData.username.trim()) {
      next.username = 'نام کاربری الزامی است.';
      valid = false;
    }
    if (!formData.password.trim()) {
      next.password = 'رمز عبور الزامی است.';
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    if (!validate() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // رمز عبور بدون هیچ تغییری به لایه احراز هویت ارسال می‌شود.
      const result = await login({
        username: formData.username,
        password: formData.password,
      });

      if (!result.success) {
        setServerError(result.error || 'نام کاربری یا رمز عبور نادرست است.');
        return;
      }

      navigate('/', { replace: true });
    } catch {
      setServerError('خطای غیرمنتظره‌ای رخ داد. لطفا دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (serverError) setServerError(null);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand" aria-hidden="true">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="var(--login-accent)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <rect width="20" height="20" x="2" y="2" rx="4" ry="4" />
              <line x1="16" y1="2" x2="16" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <h1 className="login-title">ورود به سامانه</h1>
          <p className="login-subtitle">لطفا نام کاربری و رمز عبور خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="username" className="login-label">
              نام کاربری
            </label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" size="18" strokeWidth="1.6" aria-hidden="true" />
              <input
                id="username"
                className={`login-input${errors.username ? ' login-input--error' : ''}`}
                autoComplete="username"
                autoFocus
                required
                disabled={isSubmitting}
                placeholder="نام کاربری خود را وارد کنید"
                value={formData.username}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? 'username-error' : undefined}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </div>
            {errors.username && (
              <span id="username-error" className="login-error-text" role="alert">
                {errors.username}
              </span>
            )}
          </div>

          <div className="login-field login-password-wrapper">
            <label htmlFor="password" className="login-label">
              رمز عبور
            </label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size="18" strokeWidth="1.6" aria-hidden="true" />
              <input
                id="password"
                className={`login-input login-password-input${errors.password ? ' login-input--error' : ''}`}
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز عبور خود را وارد کنید"
                value={formData.password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <button
                type="button"
                className="login-toggle"
                aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                aria-pressed={showPassword}
                disabled={isSubmitting}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff size="18" strokeWidth="1.6" aria-hidden="true" />
                ) : (
                  <Eye size="18" strokeWidth="1.6" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="login-error-text" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {serverError && (
            <div className="login-server-error" role="alert">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <ArrowLeft size="18" strokeWidth="1.8" aria-hidden="true" />
            {isSubmitting ? 'در حال ورود...' : 'ورود به پنل کاربری'}
          </button>
        </form>
      </div>
    </div>
  );
}
