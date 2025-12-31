import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:4000/api/auth/login",
                {
                    email,
                    password,
                }
            );
            if (response.data.success) {
                await login(response.data.token, response.data.user);
                if (response.data.user.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (response.data.user.role === "client") {
                    navigate("/client/dashboard");
                } else if (response.data.user.role === "staff") {
                    navigate("/staff/dashboard");
                } else if (response.data.user.role === "manager") {
                    navigate("/manager/dashboard");
                } else if (response.data.user.role === "supplier") {
                    navigate("/supplier/dashboard");
                } else if (response.data.user.role === "warehouse") {
                    navigate("/warehouse/dashboard");
                } else if (response.data.user.role === "accountant") {
                    navigate("/accountant/dashboard");
                } else {
                    alert(response.data.error);
                }
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-green-600 from-50% to-gray-100 to-50% space-y-6">
            <h2 className="text-3xl text-white"> Inventory Management System</h2>
            <div className="bg-white border p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login to Your Account
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
