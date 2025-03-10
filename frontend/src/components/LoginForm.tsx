import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import naruto from '../assets/naruto.png';
import {Eye, EyeOff} from 'lucide-react';

const WaveIcon = () => (
  <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full">
    <path fill="#f3f4f6" fillOpacity="0.1" d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,122.7C672,117,768,75,864,74.7C960,75,1056,117,1152,122.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);
axios.defaults.baseURL = "http://localhost:5002";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0); // 0: no animation, 1: sliding, 2: fading
  const [inputFocus, setInputFocus] = useState({
    name: false,
    email: false,
    password: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // Changed from Navigate to navigate
  // Reset animation if needed
  useEffect(() => {
    if (animationPhase === 2) {
      const timer = setTimeout(() => {
        setAnimationPhase(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  const handleToggle = () => {
    // Start sliding phase
    setAnimationPhase(1);
    
    // After sliding completes, switch to fading phase
    setTimeout(() => {
      setIsLogin(!isLogin);
      setAnimationPhase(2);
      // Form data reset happens in the useEffect
    }, 600);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, formData);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true); // Update auth state directly
        navigate('/');
      } else {
        setIsLogin(true);
        setFormData({ ...formData, name: '' });
      }
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Animated shapes for background
  const AnimatedShapes = () => (
    <>
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{filter: 'blur(24px)', animationDuration: '4s'}} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{filter: 'blur(20px)', animationDuration: '6s', animationDelay: '1s'}} />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500 rounded-full opacity-20 animate-pulse" style={{filter: 'blur(28px)', animationDuration: '8s', animationDelay: '2s'}} />
    </>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-7rem)] p-4">
      <div 
        className="relative overflow-hidden rounded-3xl shadow-xl max-w-3xl w-full bg-white"
        style={{ height: '32rem' }}
      >
        <AnimatedShapes />
        
        {/* Sliding overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 z-20 transition-all duration-500 ease-in-out flex items-center justify-center"
          style={{
            transform: animationPhase === 1 
              ? 'translateX(0%)' 
              : animationPhase === 0 
                ? (isLogin ? 'translateX(100%)' : 'translateX(-100%)') 
                : (isLogin ? 'translateX(-100%)' : 'translateX(100%)'),
            opacity: animationPhase === 2 ? 0 : 1,
            transitionDuration: '600ms'
          }}
        >
          <div className="text-white text-center">
            <div className="text-3xl font-bold mb-2">
              {isLogin ? 'Creating New Account' : 'Welcome Back'}
            </div>
            <div className="text-lg text-purple-200">
              {isLogin ? 'Just a moment...' : 'Loading your profile...'}
            </div>
            
            {/* Loading animation */}
            <div className="flex justify-center mt-6">
              <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>

        {/* Container that holds both forms */}
        <div className="flex h-full">
          {/* Login/Signup Form */}
          <div className="w-full md:w-1/2 p-8 z-10 relative mt-10">
            <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Login' : 'Sign Up'}</h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin ? 'Welcome back! Please enter your details' : 'Create an account to get started'}
            </p>
            
            {/* Form Fields */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {!isLogin && (
                <div className="relative">
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    onFocus={() => setInputFocus({...inputFocus, name: true})}
                    onBlur={() => setInputFocus({...inputFocus, name: false})}
                    className={`w-full p-2.5 pl-3 border rounded-lg transition-all duration-300 outline-none ${
                      inputFocus.name 
                        ? 'border-purple-600 shadow-sm shadow-purple-100' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>
              )}
              
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
                {isPasswordHidden ? (
                  <Eye className='absolute top-3 right-2 transition-all duration-200' onClick={() => setIsPasswordHidden(false)}/>

                ):(
                  <EyeOff className='absolute top-3 right-2 transition-all duration-200' onClick={() => setIsPasswordHidden(true)}/>
                )}
              </div>
              
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
                  </div>
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    Forgot Password?
                  </a>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[0.99] active:scale-[0.97] shadow-md uppercase text-sm font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-95'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>
            
            {/* Mobile toggle button */}
            <div className="mt-6 text-center md:hidden">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button"
                  onClick={handleToggle}
                  className="ml-2 text-purple-700 font-medium hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
          {/* Right purple panel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 text-white items-center justify-center z-10 relative overflow-hidden">
            <WaveIcon />
          <img src={naruto} alt="naruto-img" className='h-[50%] absolute -left-5'/>
            
            <div className="text-center p-10 relative z-10">
              <div className="h-24 w-24 rounded-full bg-purple-500 bg-opacity-30 mx-auto mb-4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                {isLogin ? 'New Here?' : 'Welcome Back!'}
              </h3>
              <p className="mb-6 text-purple-100">
                {isLogin 
                  ? 'Sign up and discover a great amount of new opportunities!' 
                  : 'To keep connected with us please login with your personal info'}
              </p>
              <button 
                type="button"
                onClick={handleToggle}
                className="border-2 border-white text-white py-2.5 px-8 rounded-full hover:bg-white hover:text-purple-700 transition-all duration-300 uppercase text-sm font-medium"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;