export default function JobCard({ job, onViewApplications }) {
    return (
      <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
        <h3>{job.title}</h3>
        <p>Category: {job.category}</p>
        <p>Location: {job.location}</p>
        <p>Budget: ${job.budget}</p>
        <p>Fair Price Estimate: ${job.fair_price_estimate}</p>
        <button onClick={() => onViewApplications(job.id)}>View Applications</button>
      </div>
    );
  }