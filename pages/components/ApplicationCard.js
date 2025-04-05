export default function ApplicationCard({ application }) {
    return (
      <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
        <p>Message: {application.message}</p>
        <p>Price Quote: ${application.price_quote}</p>
        <p>Status: {application.status}</p>
      </div>
    );
  }