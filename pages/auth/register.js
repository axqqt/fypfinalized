import { useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [formData, setFormData] = useState({ userType: "contractor" });
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

      // Prepare data for the backend
      const requestData = {
        username: formData.username,
        password: formData.password,
        user_type: formData.userType,
      };

      // Send POST request to the backend /api/register endpoint
      const response = await apiClient.post("/register", requestData);

      // Show success message
      toast.success(response.data.message);

      // Redirect to the home page or login page after successful registration
      router.push("/auth/login");
    } catch (error) {
      // Handle errors (e.g., duplicate username, server error)
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
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
          <label style={{ display: "block", marginBottom: "0.5rem" }}>User Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="contractor">Contractor</option>
            <option value="tradesman">Tradesman</option>
          </select>
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}