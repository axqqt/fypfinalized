import { useEffect, useState } from "react";
import apiClient from "@/apiClient";
import JobCard from "../components/JobCard";
import ApplicationCard from "../components/ApplicationCard";

export default function ViewApplications() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await apiClient.get("/jobs");
      setJobs(response.data.jobs);
    };
    fetchJobs();
  }, []);

  const handleViewApplications = async (jobId) => {
    const response = await apiClient.get(`/jobs/${jobId}/applications`);
    setApplications(response.data.applications);
  };

  return (
    <div>
      <h1>View Applications</h1>
      <div>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onViewApplications={handleViewApplications} />
        ))}
      </div>
      <div>
        <h2>Applications</h2>
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}