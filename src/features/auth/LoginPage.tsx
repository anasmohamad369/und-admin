import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, PhoneCall, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/common';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(selectedRole, phoneOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-stone-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Gradient */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header with NutriFarm Logo */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-md border border-stone-200 mx-auto mb-3 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="NutriFarm Chicken Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">NutriFarm Chicken</h1>
          <p className="text-xs font-semibold text-amber-700 mt-0.5">A Fresh & Healthy Chicken</p>
          <p className="text-xs text-stone-500 mt-1">Multi-Farm B2B Operations Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="Enter mobile or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                System Role Context
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="SUPER_ADMIN">Super Administrator</option>
                  <option value="ADMIN">Admin User</option>
                  <option value="FARM_MANAGER">Farm Manager</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager</option>
                  <option value="OPERATIONS_MANAGER">Operations Manager</option>
                  <option value="FINANCE">Finance Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to NutriFarm Portal'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-500 font-medium">
              Spring Boot REST API & JWT Security Integrated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
