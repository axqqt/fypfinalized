import { useState } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
export default function Login() {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/login", formData);
      sessionStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Logged in successfully!");
      if (response.data.user_type === "contractor") {
        router.push("/contractor/dashboard");
      } else {
        router.push("/tradesman/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}