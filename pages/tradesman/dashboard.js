import { useState, useEffect } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function TradesmanDashboard() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get(`/jobs?status=open`);
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    router.push(`/tradesman/apply-for-job?job_id=${jobId}`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Tradesman Dashboard</h1>
        <h2>Open Jobs</h2>
        {jobs.length === 0 ? (
          <p>No open jobs available at the moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {jobs.map((job) => (
              <li key={job.id} style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "1rem" }}>
                <h3>{job.title}</h3>
                <p><strong>Category:</strong> {job.category}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Budget:</strong> ${job.budget}</p>
                <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                <button onClick={() => handleApply(job.id)} style={{ padding: "0.5rem 1rem", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Apply Now
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}