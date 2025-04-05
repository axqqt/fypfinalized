import { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

export default function AddJob() {
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("User not registered. Please register first.");
      return;
    }

    try {
      // Attach contractor ID to formData
      formData.contractor_id = user.id;

      // Send POST request to create a new job
      const response = await apiClient.post("/create-job", formData);

      // Show success message and redirect
      toast.success("Job created successfully!");
      router.push(`/contractor/view-applications?job_id=${response.data.job.id}`);
    } catch (error) {
      // Handle errors
      toast.error(error.response?.data?.error || "Failed to create job.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
        <h1>Add Job</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              resize: "vertical",
            }}
          />
          <input
            type="number"
            name="area_sqm"
            placeholder="Area (sqm)"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="number"
            name="complexity_score"
            placeholder="Complexity Score"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="number"
            name="material_quality_score"
            placeholder="Material Quality Score"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="date"
            name="deadline"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Create Job
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}