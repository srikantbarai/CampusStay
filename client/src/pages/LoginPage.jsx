import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Building2, Users } from "lucide-react";

import useLogin from "../hooks/useLogin";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginMutation, isPending, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full max-h-[90vh] bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        <div className="p-6 md:p-8">
          {error && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              {error?.response?.data?.message || "Login failed. Please try again."}
            </div>
          )}
          
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-blue-600 mr-2" />
              <h2 className="text-3xl font-extrabold text-gray-800">HostelMS</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Hostel Management System
            </p>
            <h1 className="text-xl font-semibold mt-4 text-gray-700">Welcome back, please sign in</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="flex items-center text-gray-700 font-medium mb-2 gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="student@example.com or admin@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center text-gray-700 font-medium mb-2 gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-md transition duration-200 flex items-center justify-center"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact your hostel administrator
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8 text-center">
          <div className="bg-white rounded-full p-6 shadow-lg mb-6">
            <Building2 className="w-16 h-16 text-blue-600" />
          </div>
          
          <h3 className="font-bold text-blue-900 text-xl mb-4">Hostel Management System</h3>
          
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center text-sm">
              <Users className="w-5 h-5 text-blue-600 mr-3" />
              <span>Student & Admin Access</span>
            </div>
            <div className="flex items-center text-sm">
              <Building2 className="w-5 h-5 text-blue-600 mr-3" />
              <span>Room Allocation & Management</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-6 leading-relaxed">
            Streamline hostel operations with our comprehensive management system. 
            Students can view room allotments and request changes, while administrators 
            can efficiently manage student records and room assignments.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;