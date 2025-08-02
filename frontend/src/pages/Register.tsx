import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Leaf, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import { isValidEmail } from '../utils/helpers';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { 
      email?: string; 
      password?: string; 
      confirmPassword?: string; 
    } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await register(email, password);
    setIsLoading(false);

    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <Leaf className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-wellness-primary">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-wellness-secondary">
            Join the wellness session platform
          </p>
        </div>

        {/* Register Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="card">
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
                placeholder="Enter your email"
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Create a password"
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                icon={<Lock className="w-4 h-4" />}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                icon={<UserPlus className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Create account
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-wellness-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;


