import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';  // Update the import path
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import naruto from '../../assets/naruto.png';

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex h-full surface rounded-2xl shadow-2xl overflow-hidden">
      <div className="w-full md:w-1/2 p-8">
        <h2 className="font-display text-2xl font-bold mb-2 text-white">Welcome Back</h2>
        <p className="text-slate-400 text-sm mb-6">Please enter your details</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="input-field py-2.5 pl-10 pr-3"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type={isPasswordHidden ? 'password' : 'text'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="input-field py-2.5 pl-10 pr-10"
            />
            <button
              type="button"
              aria-label={isPasswordHidden ? 'Show password' : 'Hide password'}
              onClick={() => setIsPasswordHidden(!isPasswordHidden)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isPasswordHidden ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded accent-violet-600"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-400">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm text-violet-400 hover:text-violet-300">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-violet-600/25 disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-violet-400 hover:text-violet-300 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white items-center justify-center relative overflow-hidden">
        <img src={naruto} alt="naruto" className="h-1/2 absolute -left-5 opacity-90" />
        <div className="text-center p-8 relative z-10">
          <h3 className="font-display text-2xl font-bold mb-4">New Here?</h3>
          <p className="mb-6 text-violet-100">
            Sign up and discover a great amount of new opportunities!
          </p>
          <button
            type="button"
            onClick={onToggle}
            className="border-2 border-white text-white py-2.5 px-8 rounded-full hover:bg-white hover:text-violet-700 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>

  );
};

export default LoginForm;
