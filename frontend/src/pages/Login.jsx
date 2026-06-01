import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@crm.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      alert("Invalid login. Use admin@crm.com / admin123");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <h1>Mini CRM</h1>
        <p>Admin Login</p>

        <input
          type="email"
          placeholder="Email: admin@crm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password: admin123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;