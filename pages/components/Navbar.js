import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
      <Link href="/">Home</Link> |{" "}
      <Link href="/auth/login">Login</Link> |{" "}
      <Link href="/auth/register">Register</Link>
    </nav>
  );
}