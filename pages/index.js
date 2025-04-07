import { useState, useEffect } from "react";
import apiClient from "@/apiClient";
import { useRouter } from "next/router";
import Navbar from "./components/Navbar";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
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

  // Fetch tradesman's applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user) {
          const response = await apiClient.get(`/tradesman/${user.id}/applications`);
          setApplications(response.data.applications);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [user]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>My Applications</h1>
        {applications.length === 0 ? (
          <p>No applications found. Apply for a job now.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {applications.map((app) => (
              <li key={app.id} style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "1rem" }}>
                <h3>{app.job_details?.title || "Job details unavailable"}</h3>
                <p><strong>Status:</strong> {app.status}</p>
                <p><strong>Price Quote:</strong> ${app.price_quote}</p>
                <p><strong>Message:</strong> {app.message}</p>
                <p><strong>Applied On:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                <p><strong>Job Category:</strong> {app.job_details?.category || "N/A"}</p>
                <p><strong>Job Location:</strong> {app.job_details?.location || "N/A"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}