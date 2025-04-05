import { useState } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); // To handle loading state
  const router = useRouter();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      // Validate required fields
      if (!formData.username || !formData.password) {
        toast.error("Username and password are required.");
        setLoading(false);
        return;
      }

      // Send POST request to the backend /api/login endpoint
      const response = await apiClient.post("/login", formData);

      // Show success message
      toast.success(response.data.message);

      // Store user data in sessionStorage (simulate authentication)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.user_id,
            type: response.data.user_type,
          })
        );
      }

      // Redirect to the home page or dashboard after successful login
      if(response.data.user_type === "contractor") {
        router.push("/contractor/dashboard");
      }else{
        router.push("/tradesman/dashboard");
      }
    } catch (error) {
      // Handle errors (e.g., invalid credentials, server error)
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button while loading
          style={{
            width: "100%",
            padding: "0.75rem",
            background: loading ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}