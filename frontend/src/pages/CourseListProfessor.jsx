import React, { useEffect, useState } from "react";
import { getCoursesByProfessor, createCourse, updateCourse, deleteCourse } from "../services/courseService";
import { getStatsByCourse } from "../services/statService";
import { getEnrollmentCalendar } from "../services/enrollmentService";
import { createOffer } from "../services/offerService";
import { useAuth } from "../context/AuthContext";
import styles from "./CourseListProfessor.module.css";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { getAllLanguages } from "../services/languageService";
import { format, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";
import { ro } from "date-fns/locale";

function normalizeMonthlyStats(rawData) {
  // Map actual data to a lookup object
  const monthMap = {};
  rawData.forEach(entry => {
    monthMap[entry.month] = entry.count;
  });

  // Create a complete list of months in current year
  const allMonths = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  });

  // Return normalized array
  return allMonths.map(date => {
    const key = format(date, "yyyy-MM"); // "2024-03"
    const label = format(date, "MMM", { locale: ro }); // 👈 short format
    return {
      month: label.charAt(0).toUpperCase() + label.slice(1), // Capitalize
      count: monthMap[key] || 0,
    };
  });
}

export default function CourseListProfessor() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    userId: user?.id || "",
    title: "",
    description: "",
    domain: "",
    startDate: "",
    endDate: "",
    sessions: "",
    price: "",
    seats: "",
    languageId: "",
  });

  const [calendarData, setCalendarData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState([]);

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerFormData, setOfferFormData] = useState({
    courseId: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [languages, setLanguages] = useState([]);

  const fetchCourses = async () => {
    if (!user?.id) return;
    const res = await getCoursesByProfessor(user.id);
    setCourses(res);
    setFilteredCourses(res);
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await getAllLanguages();
        setLanguages(res);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourseId) {
      await updateCourse(editingCourseId, formData);
    } else {
      await createCourse(user.id, formData);
    }
    setFormData({
      userId: user?.id || "",
      title: "",
      description: "",
      domain: "",
      startDate: "",
      endDate: "",
      sessions: "",
      price: "",
      seats: "",
      languageId: "",
    });
    setEditingCourseId(null);
    setShowForm(false);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditingCourseId(course.id);
    setFormData({ ...course });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    fetchCourses();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNewCourse = () => {
    setEditingCourseId(null);
    setFormData({
      id: "",
      userId: user?.id || "",
      title: "",
      description: "",
      domain: "",
      startDate: "",
      endDate: "",
      sessions: "",
      price: "",
      seats: "",
      languageId: "",
    });
    setShowForm(true);
  };

  const handleViewCalendar = async (courseId) => {
    const data = await getEnrollmentCalendar(courseId);
    setCalendarData(data);
    setShowCalendar(true);
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const found = calendarData.find((d) => d.date === dateString);
    setSelectedDate(dateString);
    setSelectedStudents(found ? found.students : []);
  };

  const handleViewStats = async (courseId) => {
    try {
      const data = await getStatsByCourse(courseId, token);
      const cleanedData = normalizeMonthlyStats(data);
      setStatsData(cleanedData);
      setShowStats(true);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const openOfferForm = (courseId) => {
    setOfferFormData({
      courseId,
      discount: "",
      startDate: "",
      endDate: "",
    });
    setShowOfferForm(true);
  };

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferFormData({ ...offerFormData, [name]: value });
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOffer(offerFormData, token);
      alert("Ofertă adăugată cu succes!");
      setShowOfferForm(false);
    } catch (error) {
      console.error("Eroare la adăugarea ofertei:", error);
      alert("A apărut o eroare.");
    }
  };

  return (
    <div>
      <div className={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className={styles.logo}>eLearning</span>
          <button onClick={handleNewCourse} className={styles.addBtn}>Adaugă curs</button>
        </div>
        <input
          type="text"
          placeholder="Caută curs..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>

      <div className={styles.container}>
        <div className={styles.courseList}>
          {filteredCourses.length === 0 ? (
            <p>Nu există cursuri.</p>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p><strong>Domeniu:</strong> {course.domain}</p>
                <p><strong>Perioadă:</strong> {course.startDate} - {course.endDate}</p>
                <p><strong>Sesiuni:</strong> {course.sessions}</p>
                <p><strong>Preț:</strong>
                  {course.Offers?.length > 0
                    ? (
                      <>
                        <span style={{ textDecoration: "line-through", color: "gray" }}>
                          {course.price}€
                        </span>{" "}
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          {(course.price * (1 - course.Offers[0].discount / 100)).toFixed(2)}€
                        </span>
                      </>
                    )
                    : `${course.price}€`
                  }
                </p>
                <p><strong>Locuri:</strong> {course.seats}</p>
                <p><strong>Limbă:</strong> {course.Language?.name || "N/A"}</p>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(course)} className={styles.edit}>Editează</button>
                  <button onClick={() => handleViewCalendar(course.id)} className={styles.secondary}>Calendar înrolări</button>
                  <button onClick={() => handleViewStats(course.id)} className={styles.secondary}>Vezi statistici</button>
                  <button onClick={() => openOfferForm(course.id)} className={styles.secondary}>Adaugă ofertă</button>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => handleDelete(course.id)} className={styles.delete}>Șterge</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2>{editingCourseId ? "Editează curs" : "Adaugă curs"}</h2>
            <form onSubmit={handleSubmit} className={styles.popupFormFields}>
              {Object.keys(formData)
                .filter((key) => key !== "id" && key !== "userId")
                .map((key) => {
                  if (key === "languageId") {
                    return (
                      <div key={key} className={styles.popupFieldWrapper}>
                        <label htmlFor={key} className={styles.popupLabel}>Limbă</label>
                        <select
                          id={key}
                          name={key}
                          value={formData[key]}
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
                    );
                  }

                  return (
                    <div key={key} className={styles.popupFieldWrapper}>
                      <label htmlFor={key} className={styles.popupLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        id={key}
                        type={key.includes("Date") ? "date" : "text"}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        required
                        className={styles.popupInput}
                      />
                    </div>
                  );
                })}
              <div className={styles.popupActions}>
                <button type="submit">Salvează</button>
                <button type="button" onClick={() => setShowForm(false)}>Anulează</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showOfferForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2>Adaugă ofertă</h2>
            <form onSubmit={handleOfferSubmit} className={styles.popupFormFields}>
              <div className={styles.popupFieldWrapper}>
                <label htmlFor="discount" className={styles.popupLabel}>Reducere (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={offerFormData.discount}
                  onChange={handleOfferChange}
                  required
                  className={styles.popupInput}
                />
              </div>
              <div className={styles.popupFieldWrapper}>
                <label htmlFor="startDate" className={styles.popupLabel}>Dată început</label>
                <input
                  type="date"
                  name="startDate"
                  value={offerFormData.startDate}
                  onChange={handleOfferChange}
                  required
                  className={styles.popupInput}
                />
              </div>
              <div className={styles.popupFieldWrapper}>
                <label htmlFor="endDate" className={styles.popupLabel}>Dată sfârșit</label>
                <input
                  type="date"
                  name="endDate"
                  value={offerFormData.endDate}
                  onChange={handleOfferChange}
                  required
                  className={styles.popupInput}
                />
              </div>
              <div className={styles.popupActions}>
                <button type="submit">Salvează</button>
                <button type="button" onClick={() => setShowOfferForm(false)}>Anulează</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCalendar && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2>Calendar înrolări</h2>
            <Calendar onClickDay={handleDateClick} />
            {selectedDate && (
              <div>
                <h3>Studenți înrolați la {selectedDate}:</h3>
                <ul>
                  {selectedStudents.length === 0 ? (
                    <li>Niciun student în această zi.</li>
                  ) : (
                    selectedStudents.map((s) => <li key={s.id}>{s.name}</li>)
                  )}
                </ul>
              </div>
            )}
            <div className={styles.popupActions}>
              <button onClick={() => setShowCalendar(false)}>Închide</button>
            </div>
          </div>
        </div>
      )}

      {showStats && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2>Statistici înrolări</h2>
            {statsData.length === 0 ? (
              <p>Nu există date disponibile.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    interval={0}           // 👈 Force all labels to show
                    angle={-45}            // 👈 Rotate for better spacing
                    textAnchor="end"       // 👈 Align rotated labels properly
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            <div className={styles.popupActions}>
              <button onClick={() => setShowStats(false)}>Închide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
