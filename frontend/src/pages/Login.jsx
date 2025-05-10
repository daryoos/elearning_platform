import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Auth.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      login(res);
      if (res.user.role === "student") {
        navigate("/student/courses");
      } else if (res.user.role === "professor") {
        navigate("/professor/courses");
      } else {
        navigate("/courses");
      }
    } catch (err) {
      alert("Invalid email or password.");
    }
  };

  return (
    <>
      <div className={styles.fullHeader}>
        <div className={styles.logo}>eLearning</div>
        <Link to="/courses" className={styles.homeLink}>Home</Link>
      </div>
      <div className={styles.authContainer}>
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <div className={styles.switch}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </>
  );
}
