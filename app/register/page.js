"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields");
    const success = registerUser(email, password);
    if (!success) return alert("User already exists");
    alert("Registered successfully! Please login.");
    router.push("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Register a new account</p>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Register</button>
        </form>
        <p className="register-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      <style jsx>{`
        .auth-container { display:flex; justify-content:center; align-items:center; height:100vh; background:linear-gradient(135deg,#6a11cb,#2575fc); font-family:Arial,sans-serif; }
        .auth-card { background:white; padding:40px 30px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.15); width:350px; text-align:center; transition:transform 0.3s ease; }
        .auth-card:hover { transform:translateY(-5px); }
        h2 { margin-bottom:5px; color:#333; }
        .subtitle { margin-bottom:20px; color:#666; font-size:14px; }
        input { display:block; width:100%; padding:12px 15px; margin-bottom:15px; border:1px solid #ccc; border-radius:8px; font-size:14px; transition:border 0.3s, box-shadow 0.3s; }
        input:focus { outline:none; border-color:#2575fc; box-shadow:0 0 5px rgba(37,117,252,0.5); }
        button { width:100%; padding:12px; background:#2575fc; color:white; font-size:16px; font-weight:bold; border:none; border-radius:8px; cursor:pointer; transition:background 0.3s, transform 0.2s; }
        button:hover { background:#6a11cb; transform:scale(1.05); }
        .register-text { margin-top:15px; font-size:14px; color:#555; }
        .register-text a { color:#2575fc; text-decoration:none; font-weight:bold; transition:color 0.3s; }
        .register-text a:hover { color:#6a11cb; }
      `}</style>
    </div>
  );
}
