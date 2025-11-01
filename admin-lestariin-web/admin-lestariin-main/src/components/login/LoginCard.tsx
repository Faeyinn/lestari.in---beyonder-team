import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { InputField } from './InputField';
import { Button } from './Button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '@/utils/apiConfig';

export const LoginCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
        confirmButtonColor: '#0f766e'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan access_token dan refresh_token di localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('isAuthenticated', 'true');

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          confirmButtonColor: '#0f766e',
          timer: 1000,
          showConfirmButton: false,
          willClose: () => {
            navigate('/dashboard', { replace: true });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.detail || 'Invalid credentials',
          confirmButtonColor: '#0f766e'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Unable to connect to server. Please try again.',
        confirmButtonColor: '#0f766e'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      confirmButtonColor: '#0f766e',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter an email address!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: 'Please check your inbox for password reset instructions.',
          confirmButtonColor: '#0f766e'
        });
      }
    });
  };

  const handleGoogleSignIn = () => {
    Swal.fire({
      icon: 'info',
      title: 'Google Sign In',
      text: 'Google authentication would be integrated here.',
      confirmButtonColor: '#0f766e'
    });
  };

  const handleRegister = () => {
    Swal.fire({
      icon: 'info',
      title: 'Register',
      text: 'Registration page would open here.',
      confirmButtonColor: '#0f766e'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-4"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900">
        Login
      </h1>

      <div onKeyPress={handleKeyPress}>
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle={true}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <div className="text-right mb-6">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-gray-700 hover:text-teal-700 transition-colors font-medium"
          >
            Forgot password?
          </button>
        </div>

        <Button onClick={handleLogin} variant="primary" className="mb-4" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </div>

      <GoogleSignInButton onClick={handleGoogleSignIn} />

      <div className="text-center mt-6">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          onClick={handleRegister}
          className="text-gray-900 font-semibold hover:text-teal-700 transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
};