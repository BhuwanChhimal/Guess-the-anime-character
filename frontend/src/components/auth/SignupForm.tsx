import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
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

  const [inputFocus, setInputFocus] = useState({
    name: false,
    email: false,
    password: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Registration failed');
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
    <div className="flex h-full bg-white rounded-xl shadow-xl">
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm mb-6">Register to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              onFocus={() => setInputFocus({...inputFocus, name: true})}
              onBlur={() => setInputFocus({...inputFocus, name: false})}
              className={`w-full p-2.5 pl-3 border rounded-lg transition-all duration-300 outline-none ${
                inputFocus.name 
                  ? 'border-purple-600 shadow-sm shadow-purple-100' 
                  : 'border-gray-300'
              }`}
            />
          </div>

          <div className="relative">
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              onFocus={() => setInputFocus({...inputFocus, email: true})}
              onBlur={() => setInputFocus({...inputFocus, email: false})}
              className={`w-full p-2.5 pl-3 border rounded-lg transition-all duration-300 outline-none ${
                inputFocus.email 
                  ? 'border-purple-600 shadow-sm shadow-purple-100' 
                  : 'border-gray-300'
              }`}
            />
          </div>

          <div className="relative">
            <input 
              type={isPasswordHidden ? 'password' : 'text'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              onFocus={() => setInputFocus({...inputFocus, password: true})}
              onBlur={() => setInputFocus({...inputFocus, password: false})}
              className={`w-full p-2.5 pl-3 border rounded-lg transition-all duration-300 outline-none ${
                inputFocus.password 
                  ? 'border-purple-600 shadow-sm shadow-purple-100' 
                  : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setIsPasswordHidden(!isPasswordHidden)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {isPasswordHidden ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2.5 rounded-lg transition-all duration-300 hover:opacity-95 disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={onToggle}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 text-white items-center justify-center relative">
        <img src={naruto} alt="naruto" className="h-1/2 absolute -left-5" />
        <div className="text-center p-8 relative z-10">
          <h3 className="text-2xl font-bold mb-4">Welcome Back!</h3>
          <p className="mb-6 text-purple-100">
            To keep connected with us please login with your personal info
          </p>
          <button 
            type="button"
            onClick={onToggle}
            className="border-2 border-white text-white py-2.5 px-8 rounded-full hover:bg-white hover:text-purple-700 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
