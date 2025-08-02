import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "../Axios/axios.js";
import TokenContext from '../context/TokenContext.js';
import { GoogleLogin } from '@react-oauth/google';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState(null);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name || !formData.email || !formData.password) {
      setError({ message: "All fields are required" });
      return;
    }

    try {
      const result = await axios.post("/user/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ Save token and user info in context and localStorage
      tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
      userDispatch({ type: "SET_USER", payload: result.data.user });
      localStorage.setItem("authToken", JSON.stringify(result.data.token));

      setError(null); // clear error if successful
    } catch (err) {
      console.error("Registration Error:", err);
      setError({ message: err.response?.data?.message || "Registration failed" });
    }
  };

    // Google login success handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const tokenId = credentialResponse.credential;
            const result = await axios.post("/user/google-auth", { tokenId });
            tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
            userDispatch({ type: "SET_USER", payload: result.data.user });
            localStorage.setItem("authToken", JSON.stringify(result.data.token));
            setError(null);
        } catch (err) {
            // Suppress detailed error logging to avoid showing login details in browser console
            setError({ message: err.response?.data?.message || "Google registration failed" });
        }
    };

  // Google login failure handler
  const handleGoogleFailure = () => {
    setError({ message: "Google login failed" });
  };

  return (
    <div>
      {/* Redirect if user is already logged in */}
      {userToken && <Navigate to="/" />}
      
      <section className="register-container">
        <div className="container px-6 py-12 h-full">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="w-full"
                alt="Register"
              />
            </div>

            <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
              <form onSubmit={handleSubmit}>
                
                {/* ✅ Error Display */}
                {error && (
                  <div className="text-center border-2 border-red-600 p-2 mb-2 rounded-md bg-red-200 shadow-2xl">
                    {error.message}
                  </div>
                )}

                {/* ✅ Name */}
                <div className="mb-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded"
                    placeholder="Full name"
                    onChange={handleChange}
                  />
                </div>

                {/* ✅ Email */}
                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded"
                    placeholder="Email address"
                    onChange={handleChange}
                  />
                </div>

                {/* ✅ Password */}
                <div className="mb-6">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 w-full"
                >
                  Register
                </button>
              </form>
              <div className="mt-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
