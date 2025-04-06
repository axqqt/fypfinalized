import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import apiClient from "@/apiClient"; // Ensure this points to localhost:5000/api
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

export default function ContractorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);

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
      if (user) {
        try {
          setLoading(true);
          const response = await apiClient.get(`/contractors/${user.user_id}/tasks`);
          console.log("The response is", response.data);
          setJobs(response.data.tasks); // Updated to match backend structure
          setLoading(false);
        } catch (error) {
          toast.error("Failed to fetch jobs.");
          setLoading(false);
        }
      }
    };
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const handleCreateJob = () => {
    router.push("/contractor/add-job");
  };

  const handleEditJob = (jobId) => {
    router.push(`/contractor-requirements?jobId=${jobId}`);
  };

  const handleViewJob = (jobId) => {
    router.push(`/job-details/${jobId}`);
  };

  const handleViewDispute = (job) => {
    setSelectedDispute(job);
    setShowResolutionModal(true);
  };

  const handleCloseResolutionModal = () => {
    setShowResolutionModal(false);
    setSelectedDispute(null);
    setResolution("");
  };

  const handleSubmitResolution = async () => {
    if (resolution.trim() === "") {
      toast.error("Please provide a resolution description.");
      return;
    }
    try {
      await apiClient.post(`/jobs/${selectedDispute.id}/resolve-dispute`, {
        resolution: resolution,
        resolved_by: user.user_id,
      });
      toast.success("Resolution submitted successfully!");
      setJobs(
        jobs.map((job) =>
          job.id === selectedDispute.id ? { ...job, status: "ongoing" } : job
        )
      );
      handleCloseResolutionModal();
    } catch (error) {
      toast.error("Failed to submit resolution.");
    }
  };

  const ongoingJobs = jobs.filter((job) => job.status === "ongoing");
  const disputeJobs = jobs.filter((job) => job.status === "dispute");
  const completedJobs = jobs.filter((job) => job.status === "completed");

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1>Contractor Dashboard</h1>
          <button
            onClick={handleCreateJob}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Create New Job
          </button>
        </div>

        {/* Kanban Layout */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            paddingBottom: "1rem",
          }}
        >
          {/* Ongoing Jobs Column */}
          <div style={{ minWidth: "350px", flex: 1 }}>
            <div
              style={{
                backgroundColor: "#f0f8ff",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                borderTop: "5px solid #007bff",
              }}
            >
              <h2>Ongoing Jobs</h2>
            </div>
            {ongoingJobs.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  color: "#666",
                }}
              >
                No ongoing jobs
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {ongoingJobs.map((job) => (
                  <div key={job.id} style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "8px", 
                    padding: "1rem", 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}>
                    <h3>{job.title}</h3>
                    <p>{job.location}</p>
                    <p><strong>Budget:</strong> ${job.budget}</p>
                    <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                      <button onClick={() => handleViewJob(job.id)} style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        cursor: "pointer",
                      }}>View Details</button>
                      <button onClick={() => handleEditJob(job.id)} style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f8f9fa",
                        cursor: "pointer",
                      }}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disputes Column */}
          <div style={{ minWidth: "350px", flex: 1 }}>
            <div style={{ 
              backgroundColor: "#fff8f0", 
              borderRadius: "8px", 
              padding: "1rem", 
              marginBottom: "1rem",
              borderTop: "5px solid #ff7b00" 
            }}>
              <h2>Disputes</h2>
            </div>
            {disputeJobs.length === 0 ? (
              <div style={{ 
                backgroundColor: "#fff", 
                borderRadius: "8px", 
                padding: "1rem", 
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                textAlign: "center",
                color: "#666"
              }}>No disputes</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {disputeJobs.map((job) => (
                  <div key={job.id} style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "8px", 
                    padding: "1rem", 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}>
                    <h3>{job.title}</h3>
                    <p>{job.location}</p>
                    <p><strong>Issue Date:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                      <button onClick={() => handleViewDispute(job)} style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#ff7b00",
                        color: "#fff",
                        cursor: "pointer",
                      }}>Resolve Dispute</button>
                      <button onClick={() => handleViewJob(job.id)} style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f8f9fa",
                        cursor: "pointer",
                      }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Jobs Column */}
          <div style={{ minWidth: "350px", flex: 1 }}>
            <div style={{ 
              backgroundColor: "#f0fff4", 
              borderRadius: "8px", 
              padding: "1rem", 
              marginBottom: "1rem",
              borderTop: "5px solid #28a745" 
            }}>
              <h2>Completed</h2>
            </div>
            {completedJobs.length === 0 ? (
              <div style={{ 
                backgroundColor: "#fff", 
                borderRadius: "8px", 
                padding: "1rem", 
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                textAlign: "center",
                color: "#666"
              }}>No completed jobs</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {completedJobs.map((job) => (
                  <div key={job.id} style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "8px", 
                    padding: "1rem", 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}>
                    <h3>{job.title}</h3>
                    <p>{job.location}</p>
                    <p><strong>Completed:</strong> {new Date(job.updated_at).toLocaleDateString()}</p>
                    <p><strong>Budget:</strong> ${job.budget}</p>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                      <button onClick={() => handleViewJob(job.id)} style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        cursor: "pointer",
                      }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}>
            <h2>Resolve Dispute</h2>
            <p><strong>Job:</strong> {selectedDispute?.title}</p>
            <p><strong>Location:</strong> {selectedDispute?.location}</p>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="resolution" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Resolution Description
              </label>
              <textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  minHeight: "150px",
                }}
                placeholder="Describe how you plan to resolve this dispute..."
              />
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button onClick={handleCloseResolutionModal} style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}>Cancel</button>
              <button onClick={handleSubmitResolution} style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}>Submit Resolution</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}