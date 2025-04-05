import { useState, useEffect } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function ContractorDashboard() {
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
        if (user) {
          const response = await apiClient.get(`/jobs?user_id=${user.id}&user_type=contractor`);
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [user]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Contractor Dashboard</h1>
        <Link href="/contractor/add-job">Add Job</Link>
        <h2>Your Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs found. Create a new job.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {jobs.map((job) => (
              <li key={job.id} style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "1rem" }}>
                <h3>{job.title}</h3>
                <p><strong>Category:</strong> {job.category}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Budget:</strong> ${job.budget}</p>
                <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}