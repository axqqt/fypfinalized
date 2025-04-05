import { useState, useEffect } from "react";
import apiClient from "@/apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user data from sessionStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Fetch available jobs when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user) {
          toast.error("User not registered. Please register first.");
          setLoading(false);
          return;
        }

        // Fetch open jobs for tradesmen
        const response = await apiClient.get("/jobs", {
          params: {
            status: "open",
            user_type: "tradesman",
          },
        });

        setJobs(response.data.jobs);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch jobs.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  return (
    <div>
      <h1>Available Jobs</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No available jobs at the moment.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: "1rem" }}>
              <h3>{job.title}</h3>
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Budget:</strong> ${job.budget}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>
              <button
                onClick={() => window.location.href = `/apply-for-job?job_id=${job.id}`}
                style={{
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Apply Now
              </button>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
}