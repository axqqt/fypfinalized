import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import apiClient from "@/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DisputeDetails() {
  const router = useRouter();
  const { jobId } = router.query;
  const [jobDetails, setJobDetails] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch job details
  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/jobs/${jobId}`);
        setJobDetails(response.data.job); // Assuming backend returns job details
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch dispute details.");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Submit dispute report
  const handleSubmitDisputeReport = async () => {
    if (!additionalNotes.trim()) {
      toast.error("Please provide additional notes for the dispute report.");
      return;
    }

    setLoading(true);

    try {
      // Send dispute report to the backend
      await apiClient.post("/send-dispute-report", {
        phoneNumber: "+94741143323",
        jobTitle: jobDetails?.title,
        jobLocation: jobDetails?.location,
        issueDate: jobDetails?.created_at,
        additionalNotes,
      });

      toast.success("Dispute report submitted successfully!");
      router.push("/tradesman-dashboard"); // Redirect back to the dashboard
    } catch (error) {
      toast.error("Failed to submit dispute report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!jobDetails) {
    return <h1>Dispute not found.</h1>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Dispute Details</h1>
      <p><strong>Title:</strong> {jobDetails.title}</p>
      <p><strong>Location:</strong> {jobDetails.location}</p>
      <p><strong>Budget:</strong> ${jobDetails.budget}</p>
      <p><strong>Issue Date:</strong> {new Date(jobDetails.created_at).toLocaleDateString()}</p>

      {/* Additional Notes Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="additional-notes" style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}>
          Additional Notes
        </label>
        <textarea
          id="additional-notes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          required
          placeholder="Provide more details about the dispute..."
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            minHeight: "150px",
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitDisputeReport}
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "4px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "Submitting..." : "Submit Dispute Report"}
      </button>

      <ToastContainer />
    </div>
  );
}