// components/LoginForm.tsx

"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  setUserOrEmail,
  setPassword,
  submitLogin,
} from "../../../redux/slices/auth/loginSlice";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userOrEmail, password, status, error } = useAppSelector(
    (state) => state.login
  );
  const router = useRouter();

  // Redirect on successful login
  useEffect(() => {
    if (status === "succeeded") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <form className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Login to Your Account
        </h2>

        <div>
          <label htmlFor="userOrEmail" className="block text-gray-700 font-medium">
            Username or Email
          </label>
          <input
            type="text" // Changed from 'email' to 'text'
            id="userOrEmail"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={userOrEmail}
            onChange={(e) => dispatch(setUserOrEmail(e.target.value))}
            required
            placeholder="Enter your username or email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            required
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 w-full max-w-sm mx-auto text-center">
            {error}
          </p>
        )}

        <button
          type="button"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-150"
          disabled={status === "loading"}
          onClick={() => {
            dispatch(submitLogin());
          }}
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Signup here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
