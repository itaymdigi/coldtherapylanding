import { Eye, EyeOff, X } from 'lucide-react';
import { useState, useId } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function AuthModal({ isOpen, onClose, onSuccess, language = 'he' }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    gender: 'male',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generate unique IDs for form elements
  const nameId = useId();
  const genderId = useId();
  const emailId = useId();
  const passwordId = useId();
  const phoneId = useId();

  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.register);

  const translations = {
    he: {
      login: 'התחברות',
      register: 'הרשמה',
      email: 'אימייל',
      password: 'סיסמה',
      name: 'שם מלא',
      phone: 'טלפון (אופציונלי)',
      gender: 'מגדר',
      male: 'זכר',
      female: 'נקבה',
      loginButton: 'התחבר',
      registerButton: 'הירשם',
      switchToRegister: 'אין לך חשבון? הירשם',
      switchToLogin: 'יש לך חשבון? התחבר',
      close: 'סגור',
    },
    en: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone (optional)',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      loginButton: 'Login',
      registerButton: 'Register',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Have an account? Login',
      close: 'Close',
    },
  };

  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await loginMutation({
          email: formData.email,
          password: formData.password,
        });
      } else {
        result = await registerMutation({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone || '', // Always provide a string value
          gender: formData.gender,
        });
      }

      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        onSuccess(result.user, result.token);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Extract the actual error message from Convex errors
      const errorMessage = err?.message || err?.toString() || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-blue-900/95 to-cyan-900/95 rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-cyan-500/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isLogin ? t.login : t.register}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor={nameId} className="block text-white/90 mb-2 text-sm font-medium">{t.name}</label>
              <input
                id={nameId}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
                placeholder={t.name}
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor={genderId} className="block text-white/90 mb-2 text-sm font-medium">{t.gender}</label>
              <select
                id={genderId}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
              >
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor={emailId} className="block text-white/90 mb-2 text-sm font-medium">{t.email}</label>
            <input
              id={emailId}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
              placeholder={t.email}
            />
          </div>

          <div>
            <label htmlFor={passwordId} className="block text-white/90 mb-2 text-sm font-medium">{t.password}</label>
            <div className="relative">
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
                placeholder={t.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor={phoneId} className="block text-white/90 mb-2 text-sm font-medium">{t.phone}</label>
              <input
                id={phoneId}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
                placeholder={t.phone}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? '...' : isLogin ? t.loginButton : t.registerButton}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({ email: '', password: '', name: '', phone: '', gender: 'male' });
          }}
          className="w-full mt-4 text-cyan-300 hover:text-cyan-200 transition-colors text-sm"
        >
          {isLogin ? t.switchToRegister : t.switchToLogin}
        </button>
      </div>
    </div>
  );
}
