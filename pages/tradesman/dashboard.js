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
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("kanban"); // kanban or apply
  const [disputeReason, setDisputeReason] = useState("");
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null); // State to track selected dispute

  // Fetch user data on component mount
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

  // Fetch assigned jobs for the tradesman
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        const response = await apiClient.get(`/tradesman/${user.user_id}/tasks`);
        setJobs(response.data.tasks);
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      }
    };
    fetchJobs();
  }, [user]);

  // Fetch available jobs for application
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      try {
        const response = await apiClient.get("/jobs", {
          params: { status: "open" },
        });
        setAvailableJobs(response.data.jobs);
      } catch (error) {
        toast.error("Failed to fetch available jobs.");
      }
    };
    fetchAvailableJobs();
  }, []);

  // Report a dispute for a job
  const handleReportDispute = async (jobId) => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute.");
      return;
    }
    try {
      await apiClient.post(`/jobs/${jobId}/dispute`, {
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

  // Resolve a dispute for a job
  const handleResolveDispute = async (jobId) => {
    if (!resolutionDetails.trim()) {
      toast.error("Please provide resolution details.");
      return;
    }
    try {
      await apiClient.post(`/jobs/${jobId}/resolve-dispute`, {
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

  // Apply for a job
  const handleApplyForJob = async (jobId, priceQuote, estimatedDays) => {
    if (!priceQuote || !estimatedDays) {
      toast.error("Please provide a price quote and estimated days.");
      return;
    }
    try {
      await apiClient.post(`/jobs/${jobId}/applications`, {
        tradesman_id: user.user_id,
        price_quote: priceQuote,
        estimated_days: estimatedDays,
      });
      toast.success("Application submitted successfully.");
      router.reload(); // Refresh the page to reflect updated status
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to apply for the job.");
    }
  };

  // Kanban board rendering
  const renderKanbanBoard = () => {
    const groupedJobs = {
      assigned: jobs.filter((job) => job.status === "assigned"),
      ongoing: jobs.filter((job) => job.status === "ongoing"),
      dispute: jobs.filter((job) => job.status === "dispute"),
      completed: jobs.filter((job) => job.status === "completed"),
    };
    return (
      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        {Object.keys(groupedJobs).map((status) => (
          <div key={status} style={{ flex: 1, minWidth: "200px" }}>
            <h3>{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {groupedJobs[status].map((job) => (
                <li
                  key={job.id}
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4>{job.title}</h4>
                  <p>Category: {job.category}</p>
                  <p>Location: {job.location}</p>
                  <p>Budget: ${job.budget}</p>
                  {/* Dispute Form */}
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
                    <button
                      onClick={() => setSelectedDispute(job)} // Open dispute details
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#ffc107",
                        color: "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      View Dispute
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Job application interface rendering
  const renderJobApplication = () => {
    return (
      <div>
        <h2>Available Jobs</h2>
        {availableJobs.length === 0 ? (
          <p>No available jobs at the moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {availableJobs.map((job) => (
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
                <p>Category: {job.category}</p>
                <p>Location: {job.location}</p>
                <p>Budget: ${job.budget}</p>
                <p>Deadline: {job.deadline}</p>
                {/* Apply Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const priceQuote = parseFloat(
                      e.target.elements.priceQuote.value
                    );
                    const estimatedDays = parseInt(
                      e.target.elements.estimatedDays.value,
                      10
                    );
                    handleApplyForJob(job.id, priceQuote, estimatedDays);
                  }}
                >
                  <label htmlFor="priceQuote">Price Quote ($)</label>
                  <input
                    type="number"
                    id="priceQuote"
                    name="priceQuote"
                    min="0"
                    step="0.01"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <label htmlFor="estimatedDays">Estimated Days</label>
                  <input
                    type="number"
                    id="estimatedDays"
                    name="estimatedDays"
                    min="1"
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
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Apply for Job
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Render dispute details modal
  const renderDisputeModal = () => {
    if (!selectedDispute) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            width: "500px",
            maxWidth: "90%",
          }}
        >
          <h2>Dispute Details</h2>
          <p><strong>Title:</strong> {selectedDispute.title}</p>
          <p><strong>Category:</strong> {selectedDispute.category}</p>
          <p><strong>Location:</strong> {selectedDispute.location}</p>
          <p><strong>Budget:</strong> ${selectedDispute.budget}</p>

          {/* Form for submitting dispute details */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (user.user_type === "contractor") {
                handleResolveDispute(selectedDispute.id);
              } else {
                handleReportDispute(selectedDispute.id);
              }
              setSelectedDispute(null); // Close modal
            }}
          >
            <label htmlFor="dispute-details">
              {user.user_type === "contractor" ? "Resolution Details" : "Reason for Dispute"}
            </label>
            <textarea
              id="dispute-details"
              value={user.user_type === "contractor" ? resolutionDetails : disputeReason}
              onChange={(e) =>
                user.user_type === "contractor"
                  ? setResolutionDetails(e.target.value)
                  : setDisputeReason(e.target.value)
              }
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
              Submit
            </button>
            <button
              type="button"
              onClick={() => setSelectedDispute(null)} // Close modal
              style={{
                padding: "0.5rem 1rem",
                background: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "0.5rem",
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Tradesman Dashboard</h1>
        {/* Tabs for switching views */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setActiveTab("kanban")}
            style={{
              padding: "0.5rem 1rem",
              background: activeTab === "kanban" ? "#007bff" : "#f8f9fa",
              color: activeTab === "kanban" ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab("apply")}
            style={{
              padding: "0.5rem 1rem",
              background: activeTab === "apply" ? "#007bff" : "#f8f9fa",
              color: activeTab === "apply" ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Apply for Jobs
          </button>
        </div>
        {/* Render the selected tab content */}
        {activeTab === "kanban" ? renderKanbanBoard() : renderJobApplication()}
        {/* Render dispute modal if open */}
        {renderDisputeModal()}
      </div>
      <ToastContainer />
    </div>
  );
}