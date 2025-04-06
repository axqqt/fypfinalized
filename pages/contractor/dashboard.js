import { useState, useEffect } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function TradesmanDashboard() {
  const [openJobs, setOpenJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch user data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Fetch open jobs and ongoing jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch open jobs
        const openJobsResponse = await apiClient.get(`/jobs?status=open`);
        if (openJobsResponse.data && openJobsResponse.data.jobs) {
          setOpenJobs(openJobsResponse.data.jobs);
        }

        // Fetch ongoing jobs for the logged-in contractor
        const ongoingJobsResponse = await apiClient.get(
          `/jobs?status=assigned&user_id=${user?.id}&user_type=contractor`
        );
        if (ongoingJobsResponse.data && ongoingJobsResponse.data.jobs) {
          setOngoingJobs(ongoingJobsResponse.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  // Ensure user is logged in
  if (!user) {
    return <p>Please log in to view the dashboard.</p>;
  }

  // Handle job application
  const handleApply = (jobId) => {
    router.push(`/contractor/apply-job?job_id=${jobId}`);
  };

  // Handle viewing details of an ongoing job
  const handleViewJobDetails = (jobId) => {
    router.push(`/contractor/job-details?job_id=${jobId}`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 className="m-8">Contractor Dashboard</h1>

        {/* Navigation Links */}
        <div style={{ marginBottom: "1rem" }}>
          <Link href="/contractor/add-job">Add Job</Link> |{" "}
          <Link href="/contractor/manage-applications">Manage Applications</Link>
        </div>

        {/* Ongoing Jobs Section */}
        <h2 className="m-6">Ongoing Work</h2>
        {ongoingJobs.length === 0 ? (
          <p>No ongoing jobs available at the moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {ongoingJobs.map((job) => (
              <li
                key={job.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              >
                <h3>{job.title}</h3>
                <p>
                  <strong>Category:</strong> {job.category}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Budget:</strong> ${job.budget}
                </p>
                <p>
                  <strong>Status:</strong> {job.status}
                </p>
                <button
                  onClick={() => handleViewJobDetails(job.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Open Jobs Section */}
        <h2 className="m-6">Open Jobs</h2>
        {openJobs.length === 0 ? (
          <p>No open jobs available at the moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {openJobs.map((job) => (
              <li
                key={job.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              >
                <h3>{job.title}</h3>
                <p>
                  <strong>Category:</strong> {job.category}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Budget:</strong> ${job.budget}
                </p>
                <p>
                  <strong>Fair Price Estimate:</strong> ${job.fair_price_estimate}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
                {user.user_type === "tradesman" && (
                  <div>
                    <button
                      onClick={() => handleApply(job.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}