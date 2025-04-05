import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({ userType: "contractor" });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Ensure sessionStorage is only accessed on the client side
    if (typeof window !== "undefined") {
      const userId = Math.random().toString(36).substr(2, 9); // Simulate unique user ID
      sessionStorage.setItem("user", JSON.stringify({ id: userId, type: formData.userType }));
      router.push("/");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <select name="userType" onChange={handleChange}>
          <option value="contractor">Contractor</option>
          <option value="tradesman">Tradesman</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}