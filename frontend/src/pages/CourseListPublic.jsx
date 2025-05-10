import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./CourseListPublic.module.css";
import { getAllCourses } from "../services/courseService";
import { useNavigate } from "react-router-dom";

const CourseListPublic = () => {
  const [courses, setCourses] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [domain, setDomain] = useState("");
  const [domains, setDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const params = {};
    if (startDate) params.startDate = startDate.toISOString().split("T")[0];
    if (endDate) params.endDate = endDate.toISOString().split("T")[0];
    if (domain) params.domain = domain;

    try {
      const res = await getAllCourses(params);

      // Extrage toate domeniile din rezultate
      const domainSet = new Set(res.map((course) => course.domain));
      setDomains([...domainSet]);

      let filtered = [...res];

      // Filtrare după perioadă (frontend)
      filtered = filtered.filter((course) => {
        const courseStart = new Date(course.startDate);
        const courseEnd = new Date(course.endDate);
      
        // normalizează ziua
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (courseStart < start) return false;
        }
      
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (courseEnd > end) return false;
        }
      
        return true;
      });

      // Filtrare după domeniu (frontend fallback, dacă nu filtrezi în backend)
      if (domain) {
        filtered = filtered.filter((course) => course.domain === domain);
      }

      // Căutare după titlu
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCourses(filtered);
    } catch (err) {
      console.error("Eroare la preluarea cursurilor:", err);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setDomain("");
    setSearchTerm("");
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <div className={styles.logo}>eLearning</div>
        <input
          type="text"
          className={styles.search}
          placeholder="Caută cursuri..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
      </header>

      <div className={styles.filters}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Data început"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Data final"
        />
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="">Toate domeniile</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button onClick={fetchCourses}>Filtrează</button>
        <button onClick={resetFilters} className={styles.resetButton}>
          Reset
        </button>
      </div>

      <div className={styles.courseList}>
        {courses.length === 0 ? (
          <p className={styles.empty}>Niciun curs găsit.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Domeniu:</strong> {course.domain}</p>
              <p><strong>Perioadă:</strong> {course.startDate} → {course.endDate}</p>
              <p><strong>Ședințe:</strong> {course.sessions}</p>
              <p><strong>Cost:</strong>{" "}
                {course.Offers?.length > 0 ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "gray" }}>
                      {course.price}€
                    </span>{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {(course.price * (1 - course.Offers[0].discount / 100)).toFixed(2)}€
                    </span>{" "}
                    <em>({course.Offers[0].discount}% reducere)</em>
                  </>
                ) : (
                  `${course.price}€`
                )}
              </p>
              <p><strong>Locuri disponibile:</strong> {course.availableSeats}</p>
              <p><strong>Limbă:</strong> {course.Language?.name || "N/A"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseListPublic;
