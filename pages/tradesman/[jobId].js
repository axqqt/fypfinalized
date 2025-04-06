import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import apiClient from "@/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

export default function ApplyForJob() {
  const router = useRouter();
  const { jobId } = router.query; // Get job ID from URL

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    price_quote: "",
    materials_list: "",
    estimated_days: "",
    proposal_note: "",
    tradesman_id: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (!userData) {
        toast.error("You must be logged in to apply for jobs.");
        router.push("/login"); // Redirect to login page
      } else {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData((prevData) => ({
          ...prevData,
          tradesman_id: parsedUser.id,
        }));
      }
    }
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        const response = await apiClient.get(`/jobs/${jobId}`);
        console.log("====================================");
        console.log(`The response is ${JSON.stringify(response.data)}`);
        console.log("====================================");
        setJob(response.data); // ✅ updated here
        setLoading(false);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch job details."
        );
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to apply for jobs.");
      return;
    }

    const { price_quote, estimated_days } = formData;

    if (isNaN(price_quote) || parseFloat(price_quote) <= 0) {
      toast.error("Price quote must be a positive number.");
      return;
    }

    if (isNaN(estimated_days) || parseInt(estimated_days) <= 0) {
      toast.error("Estimated days must be a positive integer.");
      return;
    }

    const applicationData = {
      ...formData,
      job_id: jobId,
      tradesman_id: user.id,
      price_quote: parseFloat(formData.price_quote),
      estimated_days: parseInt(formData.estimated_days),
    };

    try {
      await apiClient.post(`/jobs/${jobId}/applications`, applicationData);
      toast.success("Application submitted successfully!");

      setTimeout(() => {
        router.push("/tradesman/my-applications");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to submit application."
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <h1>Loading job details...</h1>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <h1>Job not found</h1>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/tradesman/available-jobs")}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Back to Available Jobs
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#6c757d",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Apply for Job</h1>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
          }}
        >
          <h2>{job.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <p>
                <strong>Category:</strong> {job.category}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Area:</strong> {job.area_sqm} sqm
              </p>
              <p>
                <strong>Budget:</strong> ${job.budget}
              </p>
            </div>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <p>
                <strong>Complexity Score:</strong> {job.complexity_score}/10
              </p>
              <p>
                <strong>Material Quality:</strong> {job.material_quality_score}
                /10
              </p>
              <p>
                <strong>Deadline:</strong> {job.deadline}
              </p>
              <p>
                <strong>Fair Price Estimate:</strong> $
                {job.fair_price_estimate}
              </p>
            </div>
          </div>
          <p>
            <strong>Description:</strong> {job.description}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="price_quote" aria-describedby="price-quote-help">
            <strong>Your Price Quote ($)</strong>
          </label>
          <input
            type="number"
            id="price_quote"
            name="price_quote"
            placeholder="Enter your price quote"
            value={formData.price_quote}
            onChange={handleChange}
            required
            style={inputStyle}
            aria-describedby="price-quote-help"
          />
          <small
            id="price-quote-help"
            style={{
              display: "block",
              marginTop: "-0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Enter your estimated cost for completing the job.
          </small>

          <label htmlFor="estimated_days" aria-describedby="days-help">
            <strong>Estimated Days to Complete</strong>
          </label>
          <input
            type="number"
            id="estimated_days"
            name="estimated_days"
            placeholder="Number of days"
            value={formData.estimated_days}
            onChange={handleChange}
            required
            style={inputStyle}
            aria-describedby="days-help"
          />
          <small
            id="days-help"
            style={{
              display: "block",
              marginTop: "-0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            How many days do you estimate to complete the job?
          </small>

          <label htmlFor="materials_list">
            <strong>Materials List</strong>
          </label>
          <textarea
            id="materials_list"
            name="materials_list"
            placeholder="List the materials you'll use"
            value={formData.materials_list}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              height: "100px",
              resize: "vertical",
            }}
          />

          <label htmlFor="proposal_note">
            <strong>Proposal Note</strong>
          </label>
          <textarea
            id="proposal_note"
            name="proposal_note"
            placeholder="Explain why you're the best fit for this job"
            value={formData.proposal_note}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              height: "150px",
              resize: "vertical",
            }}
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
              fontSize: "1rem",
            }}
          >
            Submit Application
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            onClick={() => router.push("/tradesman/dashboard")}
            style={{
              padding: "0.5rem 1rem",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Available Jobs
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
