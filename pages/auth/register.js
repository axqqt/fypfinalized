import { useState } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

export default function Register() {
  const [formData, setFormData] = useState({ user_type: "contractor" }); // Use "user_type" instead of "userType"
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/register", formData);
      toast.success("Registered successfully!");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <select
            name="user_type" // Use "user_type" instead of "userType"
            value={formData.user_type} // Use "user_type" instead of "userType"
            onChange={handleChange}
          >
            <option value="contractor">Contractor</option>
            <option value="tradesman">Tradesman</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}