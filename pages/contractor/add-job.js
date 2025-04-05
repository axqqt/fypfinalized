import { useState } from "react";
import apiClient from "@/apiClient";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddJob() {
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.contractor_id = user.id; // Attach contractor ID
      const response = await apiClient.post("/create-job", formData);
      toast.success("Job created successfully!");
      router.push(`/contractor/view-applications?job_id=${response.data.job.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create job");
    }
  };

  return (
    <div>
      <h1>Add Job</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="number" name="area_sqm" placeholder="Area (sqm)" onChange={handleChange} required />
        <input type="number" name="complexity_score" placeholder="Complexity Score" onChange={handleChange} required />
        <input type="number" name="material_quality_score" placeholder="Material Quality Score" onChange={handleChange} required />
        <input type="number" name="budget" placeholder="Budget" onChange={handleChange} required />
        <input type="date" name="deadline" onChange={handleChange} required />
        <button type="submit">Create Job</button>
      </form>
      <ToastContainer />
    </div>
  );
}