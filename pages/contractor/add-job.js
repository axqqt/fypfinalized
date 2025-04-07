import { useEffect, useState } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

export default function AddJob() {
  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    area_sqm: "",
    complexity_score: "",
    material_quality_score: "",
    budget: "",
    deadline: "",
    contractor_id: "", // Initialize the contractor_id field
  });
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Categories and locations from backend data
  const categories = [
    "Masonry",
    "Carpentry",
    "Plumbing",
    "Electrical",
    "Painting",
    "Tiling",
    "Roofing",
    "Foundation Work",
    "Interior Design",
    "Landscaping",
    "HVAC",
    "General Contracting",
  ];

  const locations = [
    "Colombo",
    "Gampaha",
    "Kandy",
    "Galle",
    "Negombo",
    "Jaffna",
    "Anuradhapura",
    "Batticaloa",
    "Trincomalee",
    "Matara",
    "Kurunegala",
    "Ratnapura",
    "Badulla",
    "Nuwara Eliya",
    "Hambantota",
    "Kalmunai",
    "Vavuniya",
    "Matale",
    "Puttalam",
    "Kegalle",
  ];

  // Load user data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set the contractor_id in formData as soon as we get the user
        setFormData((prevData) => ({
          ...prevData,
          contractor_id: parsedUser.id,
        }));
      }
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not registered. Please register first.");
      return;
    }

    // Double-check that contractor_id is included
    const submissionData = {
      ...formData,
      contractor_id: user.user_id, // Use the user ID from sessionStorage
      // Make sure these are converted to numbers
      area_sqm: parseFloat(formData.area_sqm),
      complexity_score: parseFloat(formData.complexity_score),
      material_quality_score: parseFloat(formData.material_quality_score),
      budget: parseFloat(formData.budget),
    };

    console.log("Submitting data:", submissionData); // Add for debugging

    try {
      // Send POST request to create a new job
      const response = await apiClient.post("/create-job", submissionData);

      // Show success message and redirect
      toast.success("Job created successfully!");
      console.log("====================================");
      console.log(`Job ID: ${JSON.stringify(response.data.job.id)}`); // Add for debugging
      console.log("====================================");
      router.push(`/contractor/dashboard`);
    } catch (error) {
      console.error("Error creating job:", error); // Add for debugging
      // Handle errors
      toast.error(error.response?.data?.error || "Failed to create job.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
        <h1>Add Job</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <input
            type="number"
            name="area_sqm"
            placeholder="Area (sqm)"
            value={formData.area_sqm}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="complexity_score"
            placeholder="Complexity Score (1-10)"
            min="1"
            max="10"
            value={formData.complexity_score}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="material_quality_score"
            placeholder="Material Quality Score (1-10)"
            min="1"
            max="10"
            value={formData.material_quality_score}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Hidden field for contractor ID */}
          <input type="hidden" name="contractor_id" value={user?.id || ""} />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Create Job
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
