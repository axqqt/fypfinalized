import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import apiClient from "@/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

export default function TradesmanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [disputeReason, setDisputeReason] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [activeTab, setActiveTab] = useState("assigned");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (!userData) {
        toast.error("You must be logged in to view this page.");
        router.push("/login");
      } else {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get(`/tradesman/tasks`);
        setJobs(response.data.tasks);
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      }
    };
    fetchJobs();
  }, []);

  const handleReportDispute = async (jobId) => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute.");
      return;
    }

    try {
      await apiClient.post(`/jobs/${jobId}/report-dispute`, {
        reported_by: user.id,
        reason: disputeReason,
      });
      toast.success("Dispute reported successfully.");
      setDisputeReason(""); // Clear input
      router.reload(); // Refresh the page to reflect updated status
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to report dispute.");
    }
  };

  const handleResolveDispute = async (disputeId) => {
    if (!resolutionDetails.trim()) {
      toast.error("Please provide resolution details.");
      return;
    }

    try {
      await apiClient.post(`/disputes/${disputeId}/resolve`, {
        resolved_by: user.id,
        resolution: resolutionDetails,
      });
      toast.success("Dispute resolved successfully.");
      setResolutionDetails(""); // Clear input
      router.reload(); // Refresh the page to reflect updated status
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to resolve dispute.");
    }
  };

  const jobStatusTabs = [
    { label: "Accepted", status: "assigned" },
    { label: "Ongoing", status: "ongoing" },
    { label: "Disputes", status: "dispute" },
    { label: "Completed", status: "completed" },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Tradesman Dashboard</h1>

        {/* Status Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          {jobStatusTabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              style={{
                padding: "0.5rem 1rem",
                background: activeTab === tab.status ? "#007bff" : "#f8f9fa",
                color: activeTab === tab.status ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <p>No jobs available in this category.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {jobs
              .filter((job) => job.status === activeTab)
              .map((job) => (
                <li
                  key={job.id}
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                  }}
                >
                  <h3>{job.title}</h3>
                  <p>Status: {job.status}</p>
                  <p>Category: {job.category}</p>
                  <p>Location: {job.location}</p>
                  <p>Budget: ${job.budget}</p>

                  {/* Report Dispute Form */}
                  {job.status === "ongoing" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReportDispute(job.id);
                      }}
                    >
                      <label htmlFor="dispute-reason">Reason for Dispute</label>
                      <textarea
                        id="dispute-reason"
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Report Dispute
                      </button>
                    </form>
                  )}

                  {/* Resolve Dispute Form */}
                  {job.status === "dispute" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleResolveDispute(job.dispute_id);
                      }}
                    >
                      <label htmlFor="resolution-details">
                        Resolution Details
                      </label>
                      <textarea
                        id="resolution-details"
                        value={resolutionDetails}
                        onChange={(e) => setResolutionDetails(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Resolve Dispute
                      </button>
                    </form>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
