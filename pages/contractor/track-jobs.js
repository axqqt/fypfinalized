import { useState, useEffect } from "react";
import apiClient from "@/apiClient"; // Replace with your API client setup
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewTradesmenApplications() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user data from sessionStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  // Fetch jobs created by the contractor
  useEffect(() => {
    const fetchContractorJobs = async () => {
      try {
        if (!user) {
          toast.error("User not registered. Please register first.");
          return;
        }

        // Fetch jobs created by the contractor
        const response = await apiClient.get("/jobs", {
          params: {
            user_id: user.id,
            user_type: "contractor",
          },
        });

        setJobs(response.data.jobs);

        // Fetch applications for each job
        const appsByJob = {};
        for (const job of response.data.jobs) {
          const appResponse = await apiClient.get(`/jobs/${job.id}/applications`);
          appsByJob[job.id] = appResponse.data.applications;
        }
        setApplications(appsByJob);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch jobs and applications.");
      }
    };

    fetchContractorJobs();
  }, [user]);

  // Helper function to render application details
  const renderApplications = (jobId) => {
    const jobApplications = applications[jobId] || [];
    return (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {jobApplications.map((app) => (
          <li key={app.id} style={{ marginBottom: "1rem" }}>
            <p><strong>Tradesman:</strong> {app.tradesman_id}</p>
            <p><strong>Price Quote:</strong> ${app.price_quote}</p>
            <p><strong>Message:</strong> {app.message}</p>
            <p><strong>Status:</strong> {app.status}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>View Tradesmen Applications</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: "2rem" }}>
              <h2>{job.title}</h2>
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <h3>Applications</h3>
              {renderApplications(job.id)}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
}