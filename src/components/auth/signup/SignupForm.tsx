"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  setRolesTargeting,
  setRelevantWorkExperience,
  submitSignup,
  verifyOtpAndRegister,
  setOTP,
  signupRequestType,
} from "@/redux/slices/auth/signupSlice";
import Select from "react-select";
import Link from "next/link";

const rolesOptions = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Data Science", label: "Data Science" },
];

const experienceOptions = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: `${i} ${i === 1 ? "year" : "years"}`,
}));

const SignupForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    otp,
    username,
    email,
    password,
    confirmPassword,
    rolesTargeting,
    relevantWorkExperience,
    status,
    error,
  } = useAppSelector((state) => state.signup);

  // Local state to handle the OTP modal
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  // const [otpValue, setOtpValue] = useState("");

  const router = useRouter();

  // On successful signup, open the OTP modal
  useEffect(() => {
    if (status === "succeeded") {
      // Instead of redirecting immediately, open the OTP modal
      setIsOtpModalOpen(true);
    }
  }, [status]);

  // You might want to do something after validating the OTP, like:
  // - Call another Redux action to verify the OTP
  // - Then redirect to a dashboard or home page, etc.
  const handleOtpSubmit = () => {
    
    dispatch(submitSignup(signupRequestType.verifyOtpAndRegister))
    .unwrap()
    .then(() => {
      router.replace("/");
    })
    .catch((err) => {
      console.error("OTP verification error:", err);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <form className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Sign Up for an Account
        </h2>

        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            required
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            required
            placeholder="Enter your email"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={confirmPassword}
            onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
            required
            placeholder="Confirm your password"
          />
        </div>

        <div>
          <label
            htmlFor="rolesTargeting"
            className="block text-gray-700 font-medium"
          >
            Roles Targeting
          </label>
          <Select
            id="rolesTargeting"
            isMulti
            options={rolesOptions}
            value={rolesTargeting.map((role) => ({
              value: role,
              label: role,
            }))}
            onChange={(selected) =>
              dispatch(setRolesTargeting(selected.map((item) => item.value)))
            }
            className="mt-2"
          />
        </div>

        <div>
          <label
            htmlFor="relevantWorkExperience"
            className="block text-gray-700 font-medium"
          >
            Relevant Work Experience
          </label>
          <Select
            id="relevantWorkExperience"
            options={experienceOptions}
            value={experienceOptions.find(
              (option) => option.value === relevantWorkExperience
            )}
            onChange={(selected) =>
              dispatch(setRelevantWorkExperience(selected?.value || 0))
            }
            className="mt-2"
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
            dispatch(submitSignup(signupRequestType.requestOTP));
          }}
        >
          {status === "loading" ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Log in here
          </Link>
        </p>
      </form>

      {isOtpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-sm p-6 rounded shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Enter OTP</h3>
            <input
              type="text"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              onChange={(e) => dispatch(setOTP(e.target.value)) }
              placeholder="Enter the 6-digit code"
            />

            <div className="flex items-center justify-end space-x-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300"
                onClick={() => setIsOtpModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleOtpSubmit}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;