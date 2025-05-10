import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Auth.module.css";
import { getAllLanguages } from "../services/languageService";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    languageId: "",
  });

  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getAllLanguages();
        setLanguages(res);
      } catch (err) {
        console.error("Eroare la încărcarea limbilor:", err);
      }
    };
    fetchLanguages();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role, // use selected role
        languageId: form.languageId,
      });
      login(res);
      if (res.user.role === "student") {
        navigate("/student/courses");
      } else if (res.user.role === "professor") {
        navigate("/professor/courses");
      } else {
        navigate("/courses"); // fallback
      }
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <>
      <div className={styles.fullHeader}>
        <div className={styles.logo}>eLearning</div>
        <Link to="/courses" className={styles.homeLink}>Home</Link>
      </div>
      <div className={styles.authContainer}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* 👇 Role Selector */}
          <div className={styles.popupFieldWrapper}>
            <label className={styles.popupLabel} htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className={styles.popupInput} // sau styles.select dacă preferi
            >
              <option value="student">Student</option>
              <option value="professor">Profesor</option>
            </select>
          </div>
          <div className={styles.popupFieldWrapper}>
            <label className={styles.popupLabel} htmlFor="preferredLanguageId">Limba preferată</label>
            <select
              id="languageId"
              name="languageId"
              value={form.languageId}
              onChange={handleChange}
              required
              className={styles.popupInput}
            >
              <option value="">Selectează limba</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Register</button>
        </form>
        <div className={styles.switch}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </>
  );
}
