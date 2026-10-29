import { LogOut, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './auth.css';

/** نمایش کاربر واردشده و خروج؛ خروج هم state و هم نشست ذخیره‌شده را پاک می‌کند. */
export function AuthControls() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    try {
      logout();
    } catch {
      // State cleanup is handled by AuthProvider; still leave the login screen.
    }
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-controls">
      <span className="auth-user" title={user.username}>
        <UserRound size={14} strokeWidth={1.8} aria-hidden="true" />
        {user.username}
      </span>
      <button type="button" className="auth-logout" onClick={handleLogout}>
        <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>خروج</span>
      </button>
    </div>
  );
}
