import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#007bff", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/">
          <h1 style={{ margin: 0, cursor: "pointer" }}>Construction Jobs</h1>
        </Link>
        {user ? (
          <div style={{ display: "flex", gap: "1rem" }}>
            <p style={{ margin: 0 }}>Welcome, {user.id}</p>
            <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", background: "#fff", color: "#007bff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/auth/login">
              <button style={{ padding: "0.5rem 1rem", background: "#fff", color: "#007bff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Login
              </button>
            </Link>
            <Link href="/auth/register">
              <button style={{ padding: "0.5rem 1rem", background: "#fff", color: "#007bff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}