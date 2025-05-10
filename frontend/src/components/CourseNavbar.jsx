import React from "react";
import styles from "./CourseNavbar.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CourseNavbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    logout;
    navigate("/courses");
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>eLearning</div>

      <input
        type="text"
        className={styles.search}
        placeholder="Caută cursuri..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default CourseNavbar;
