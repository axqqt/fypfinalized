import { useState, useEffect } from "react";
import apiClient from "@/apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ApplyForJob() {
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { job_id } = router.query;

  // Load user data from sessionStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("User not registered. Please register first.");
      return;
    }

    try {
      formData.tradesman_id = user.id; // Attach tradesman ID
      const response = await apiClient.post(`/jobs/${job_id}/applications`, formData);
      toast.success("Application submitted successfully!");
      router.push("/tradesman/track-applications");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit application");
    }
  };

  return (
    <div>
      <h1>Apply for Job</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" name="price_quote" placeholder="Price Quote" onChange={handleChange} required />
        <textarea name="message" placeholder="Message" onChange={handleChange} required />
        <button type="submit">Submit Application</button>
      </form>
      <ToastContainer />
    </div>
  );
}