import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import naruto from '../../assets/naruto.png';

interface SignupFormProps {
  onToggle: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggle }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
        <h2 className="font-display text-2xl font-bold mb-2 text-white">Create Account</h2>
        <p className="text-slate-400 text-sm mb-6">Register to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="input-field py-2.5 pl-10 pr-3"
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-violet-600/25 disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="text-violet-400 hover:text-violet-300 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white items-center justify-center relative overflow-hidden">
        <img src={naruto} alt="naruto" className="h-1/2 absolute -left-5 opacity-90" />
        <div className="text-center p-8 relative z-10">
          <h3 className="font-display text-2xl font-bold mb-4">Welcome Back!</h3>
          <p className="mb-6 text-violet-100">
            To keep connected with us please login with your personal info
          </p>
          <button
            type="button"
            onClick={onToggle}
            className="border-2 border-white text-white py-2.5 px-8 rounded-full hover:bg-white hover:text-violet-700 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
